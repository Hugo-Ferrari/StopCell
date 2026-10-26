
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

    return this.repository.executarTransacao(async (tx) => {
      // Bloqueia a OS enquanto validamos e registramos os pagamentos.
      await this.repository.bloquearOs(tx, dto.numOs, cnpjEmpresa);

      const ordemServico = await this.repository.buscarOsParaPagamento(
        tx,
        dto.numOs,
        cnpjEmpresa,
      );

      if (!ordemServico) {
        throw new NotFoundException('Ordem de serviço não encontrada');
      }

      if (ordemServico.status === 'FINALIZADO') {
        throw new BadRequestException('Ordem de serviço finalizada');
      }

      const totalOs = ordemServico.vlTotal;

      if (totalOs === null || totalOs.lessThanOrEqualTo(0)) {
        throw new BadRequestException(
          'A ordem de serviço não possui um valor total válido',
        );
      }

      const totalPago = ordemServico.pagamentos.reduce(
        (acumulado, pagamento) =>
          acumulado.plus(
            pagamento.valorPago ?? new Prisma.Decimal(0),
          ),
        new Prisma.Decimal(0),
      );

      const saldo = totalOs.minus(totalPago);

      if (saldo.lessThanOrEqualTo(0)) {
        throw new BadRequestException(
          'A ordem de serviço já está quitada',
        );
      }

      const totalSolicitado = dto.pagamentos.reduce(
        (acumulado, pagamento) =>
          acumulado.plus(new Prisma.Decimal(pagamento.valorPago)),
        new Prisma.Decimal(0),
      );

      if (totalSolicitado.greaterThan(saldo)) {
        throw new BadRequestException(
          'A soma dos pagamentos ultrapassa o saldo restante',
        );
      }

      return this.repository.registrarVarios(
        tx,
        dto.numOs,
        dto.pagamentos,
      );
    });
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
