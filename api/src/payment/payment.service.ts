import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PagamentoRepository } from './payment.repository';
import { PagamentoDto } from '@/type/payment.dto';

@Injectable()
export class PagamentoService {
  constructor(private readonly repository: PagamentoRepository) {}

  async registrar(dto: PagamentoDto, cnpjEmpresa: string) {
    if (!cnpjEmpresa) {
      throw new BadRequestException('Empresa não identificada');
    }

    const ordemServico = await this.repository.buscarOsParaPagamento(
      dto.numOs,
      cnpjEmpresa,
    );

    if (!ordemServico) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    const totalOs = ordemServico.vlTotal;

    if (totalOs === null || totalOs.lessThanOrEqualTo(0)) {
      throw new BadRequestException(
        'A ordem de serviço não possui um valor total válido',
      );
    }

    const totalPago = ordemServico.pagamentos.reduce(
      (acumulado, pagamento) =>
        acumulado.plus(pagamento.valorPago ?? new Prisma.Decimal(0)),
      new Prisma.Decimal(0),
    );

    const saldo = totalOs.minus(totalPago);
    const valorSolicitado = new Prisma.Decimal(dto.valorPago);

    if (saldo.lessThanOrEqualTo(0)) {
      throw new BadRequestException('A ordem de serviço já está quitada');
    }

    if (valorSolicitado.greaterThan(saldo)) {
      throw new BadRequestException('O pagamento ultrapassa o saldo restante');
    }

    return this.repository.registrar(dto);
  }

  async listarPagamento(cnpjEmpresa: string) {
    return this.repository.listarPagamentos(cnpjEmpresa);
  }
  async buscarPorId(idPagamento: number, cnpjEmpresa: string) {
    if (idPagamento <= 0) {
      throw new BadRequestException('ID de pagamento inválido');
    }

    const pagamento = await this.repository.buscarPorId(
      idPagamento,
      cnpjEmpresa,
    );

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }
  async listarPorOs(numOs: number, cnpjEmpresa: string) {
    if (numOs <= 0) {
      throw new BadRequestException('Número da OS inválido');
    }

    return this.repository.listarPorOs(numOs, cnpjEmpresa);
  }
}
