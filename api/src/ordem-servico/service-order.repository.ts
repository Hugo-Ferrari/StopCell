import { Injectable } from '@nestjs/common';
import { Prisma, StatusOs } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdemServicoRepository {
  constructor(private readonly prisma: PrismaService) { }

  abrir(data: any) {
    return this.prisma.ordemServico.create({ data });
  }

  findByNumOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
    });
  }
  async executarTransacao<T>(
    operacao: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    const maxTentativas = 3;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        return await this.prisma.$transaction(async (tx) => operacao(tx), {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (erro) {
        const conflitoDeConcorrencia =
          erro instanceof Prisma.PrismaClientKnownRequestError &&
          erro.code === 'P2034';

        if (!conflitoDeConcorrencia || tentativa === maxTentativas) {
          throw erro;
        }
      }
    }

    throw new Error('Não foi possível concluir a transação.');
  }
  async bloquearOs(
    tx: Prisma.TransactionClient,
    numOs: number,
    cnpjEmpresa: string,
  ): Promise<void> {
    await tx.$queryRaw`
    SELECT num_os
    FROM ordem_servico
    WHERE num_os = ${numOs}
      AND cnpj_empresa = ${cnpjEmpresa}
    FOR UPDATE
  `;
  }
  atualizarStatus(
    tx: Prisma.TransactionClient,
    numOs: number,
    status: StatusOs,
    cnpjEmpresa: string,
  ) {
    const encerrando = status === 'FINALIZADO' || status === 'CANCELADO';

    return tx.ordemServico.update({
      where: { numOs, cnpjEmpresa },
      data: {
        status,
        dtSaida: encerrando ? new Date() : undefined,
      },
    });
  }

  // a lista só precisa disso. antes vinha o aparelho inteiro, inclusive a senha dele
  listar(cnpjEmpresa: string) {
    return this.prisma.ordemServico.findMany({
      where: { cnpjEmpresa },
      select: {
        numOs: true,
        numOsAnterior: true,
        cpfCliente: true,
        imeiAparelho: true,
        dtEntrada: true,
        status: true,
        vlTotal: true,
        cliente: { select: { nmCompleto: true } },
        aparelho: { select: { modelo: true } },
      },
      orderBy: { dtEntrada: 'desc' },
    });
  }

  buscarPorNumOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
      include: {
        cliente: true,
        aparelho: true,
        usuario: { select: { idUsuario: true, nome: true } },
        diagnosticos: { orderBy: { dataHora: 'desc' } },
        itensOs: { orderBy: { idItemOs: 'asc' } },
        logNotificacoes: {
          select: { idLogNotificacao: true, tipoEvento: true, dtHoraEnvio: true, statusEnvio: true },
          orderBy: { dtHoraEnvio: 'desc' },
          take: 10,
        },
      },
    });
  }

  // tudo que vai impresso na O.S.
  buscarParaPdf(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
      include: {
        cliente: true,
        aparelho: { include: { marca: true } },
        empresa: true,
        usuario: { select: { nome: true } },
        diagnosticos: { orderBy: { dataHora: 'asc' } },
        itensOs: { orderBy: { idItemOs: 'asc' } },
        pagamentos: { orderBy: { dtPagamento: 'asc' } },
        osChecklists: { include: { checklist: true } },
      },
    });
  }
}