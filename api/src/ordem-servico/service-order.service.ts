import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusOs } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdemServicoDto } from '@/type/service-order.dto';
import { OrdemServicoRepository } from './service-order.repository';
import { OsPdfService } from './os-pdf.service';
import { gerarHtmlOrdemServico } from './service-order.template';
import { podeMudarStatus, ROTULO_STATUS } from './status-os';
import { NotificacaoOsService } from '@/notificacao/notificacao-os.service';

@Injectable()
export class OrdemServicoService {
  constructor(
    private readonly repository: OrdemServicoRepository,
    private readonly prisma: PrismaService,
    private readonly pdf: OsPdfService,
    private readonly notificacao: NotificacaoOsService,
  ) { }

  async abrir(dto: OrdemServicoDto, cnpjEmpresa: string, idUsuario: number) {
    if (!idUsuario) {
      throw new BadRequestException('Usuário não identificado. Faça login novamente.');
    }

    const usuario = await this.prisma.usuario.findFirst({
      where: { idUsuario, cnpjEmpresa },
    });
    if (!usuario)
      throw new NotFoundException('Usuário não encontrado para esta empresa');

    const cliente = await this.prisma.cliente.findFirst({
      where: { cpf: dto.cpfCliente, cnpjEmpresa },
    });
    if (!cliente)
      throw new NotFoundException('Cliente não encontrado para esta empresa');

    // o mesmo IMEI pode existir em outra loja, então busca só nesta e confere o dono
    const aparelho = await this.prisma.aparelho.findFirst({
      where: { cnpjEmpresa, imei: dto.imeiAparelho, cpfCliente: dto.cpfCliente },
    });
    if (!aparelho)
      throw new NotFoundException('Aparelho não encontrado para este cliente');

    // retrabalho só pode apontar pra uma O.S. da mesma loja
    if (dto.numOsAnterior) {
      const anterior = await this.repository.findByNumOs(dto.numOsAnterior, cnpjEmpresa);
      if (!anterior)
        throw new NotFoundException('O.S. anterior não encontrada para esta empresa');
    }

    const os = await this.repository.abrir({
      numOsAnterior: dto.numOsAnterior ?? null,
      cpfCliente: dto.cpfCliente,
      imeiAparelho: dto.imeiAparelho,
      cnpjEmpresa,
      idUsuario,
      diagnostico: dto.diagnostico,
      dtEntrada: new Date(),
      vlTotal: new Prisma.Decimal(0),
      status: 'ABERTA',
    });

    // sem await: o e-mail não pode atrasar nem derrubar a abertura da O.S.
    void this.notificacao.avisarMudancaStatus(os.numOs);

    return os;
  }

  async atualizarStatus(numOs: number, novoStatus: StatusOs, cnpjEmpresa: string) {
    if (!cnpjEmpresa) {
      throw new BadRequestException('Empresa não identificada');
    }

    const atualizada = await this.repository.executarTransacao(async (tx) => {
      await this.repository.bloquearOs(tx, numOs, cnpjEmpresa);

      const os = await tx.ordemServico.findFirst({
        where: { numOs, cnpjEmpresa },
        select: {
          numOs: true,
          vlTotal: true,
          status: true,
          pagamentos: { select: { valorPago: true } },
        },
      });

      if (!os) {
        throw new NotFoundException('Ordem de serviço não encontrada');
      }

      if (!podeMudarStatus(os.status, novoStatus)) {
        throw new BadRequestException(
          `Não dá pra mudar de "${ROTULO_STATUS[os.status]}" para "${ROTULO_STATUS[novoStatus]}".`,
        );
      }

      const totalPago = os.pagamentos.reduce(
        (total, pagamento) => total.plus(pagamento.valorPago ?? 0),
        new Prisma.Decimal(0),
      );
      const totalOs = os.vlTotal ?? new Prisma.Decimal(0);

      // mandar orçamento zerado pro cliente aprovar não faz sentido
      if (novoStatus === 'EM_APROVACAO' && totalOs.lessThanOrEqualTo(0)) {
        throw new BadRequestException(
          'Lance pelo menos uma peça ou mão de obra antes de enviar o orçamento',
        );
      }

      if (novoStatus === 'FINALIZADO') {
        if (totalOs.lessThanOrEqualTo(0)) {
          throw new BadRequestException(
            'A OS não possui um valor válido para finalização',
          );
        }

        if (totalPago.lessThan(totalOs)) {
          throw new BadRequestException(
            `Não é possível finalizar a OS. Saldo pendente: R$ ${totalOs.minus(totalPago).toFixed(2)}`,
          );
        }
      }

      // com dinheiro recebido, cancelar viraria um buraco no caixa
      if (novoStatus === 'CANCELADO' && totalPago.greaterThan(0)) {
        throw new BadRequestException(
          'Essa O.S. já tem pagamento registrado. Faça o estorno antes de cancelar.',
        );
      }

      return this.repository.atualizarStatus(tx, numOs, novoStatus, cnpjEmpresa);
    });

    // só avisa depois que a transação confirmou, senão o cliente poderia receber
    // um status que acabou não sendo salvo
    void this.notificacao.avisarMudancaStatus(numOs);

    return atualizada;
  }

  async listar(cnpjEmpresa: string) {
    return await this.repository.listar(cnpjEmpresa);
  }

  async buscarPorNumOs(numOs: number, cnpjEmpresa: string) {
    return await this.repository.buscarPorNumOs(numOs, cnpjEmpresa);
  }

  // última O.S. do aparelho, usada pra preencher o retrabalho
  async buscarUltimaOsPorImei(imei: string, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { imeiAparelho: imei, cnpjEmpresa },
      orderBy: { numOs: 'desc' },
    });
  }

  async gerarPdf(numOs: number, cnpjEmpresa: string): Promise<Buffer> {
    const os = await this.repository.buscarParaPdf(numOs, cnpjEmpresa);

    if (!os) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    return this.pdf.gerar(gerarHtmlOrdemServico(os));
  }
}