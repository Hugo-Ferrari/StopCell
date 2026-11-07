
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemPagamentoDto } from '@/type/payment.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PagamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async executarTransacao<T>(
    operacao: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    const maxTentativas = 3;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => operacao(tx),
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );
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

  registrarVarios(
    tx: Prisma.TransactionClient,
    numOs: number,
    pagamentos: ItemPagamentoDto[],
  ) {
    return Promise.all(
      pagamentos.map((pagamento) =>
        tx.pagamento.create({
          data: {
            numOs,
            valorPago: pagamento.valorPago,
            formaPagamento: pagamento.formaPagamento,
            dtPagamento: new Date(),
          },
        }),
      ),
    );
  }

  buscarOsParaPagamento(
    tx: Prisma.TransactionClient,
    numOs: number,
    cnpjEmpresa: string,
  ) {
    return tx.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
      select: {
        numOs: true,
        vlTotal: true,
        status: true,
        pagamentos: {
          select: {
            valorPago: true,
          },
        },
      },
    });
  }

  listarPagamentos(cnpjEmpresa: string) {
    return this.prisma.pagamento.findMany({
      where: {
        ordemServico: { cnpjEmpresa },
      },
    });
  }

  buscarPorId(idPagamento: number, cnpjEmpresa: string) {
    return this.prisma.pagamento.findFirst({
      where: {
        idPagamento,
        ordemServico: { cnpjEmpresa },
      },
    });
  }

  listarPorOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.pagamento.findMany({
      where: {
        numOs,
        ordemServico: { cnpjEmpresa },
      },
      orderBy: {
        dtPagamento: 'desc',
      },
    });
  }
}
