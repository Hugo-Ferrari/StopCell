import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdemServicoRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    status: string,
    cnpjEmpresa: string,
  ) {
    return tx.ordemServico.update({
      where: { numOs, cnpjEmpresa },
      data: {
        status,
        dtSaida: status === 'FINALIZADO' ? new Date() : undefined,
      },
    });
  }
  listar(cnpjEmpresa: string) {
    return this.prisma.ordemServico.findMany({
      where: { cnpjEmpresa },
      include: {
        cliente: true,
        aparelho: true,
      },
      orderBy: {
        dtEntrada: 'desc',
      },
    });
  }

  buscarPorNumOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
      include: {
        cliente: true,
        aparelho: true,
        usuario: true,
        diagnosticos: true,
        itensOs: {
          include: {
            servico: true,
            peca: true,
          },
        },
      },
    });
  }

  buscarParaPdf(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
      include: {
        cliente: true,
        aparelho: true,
        empresa: true,
        diagnosticos: true,
        itensOs: {
          include: {
            servico: true,
            peca: true,
          },
        },
      },
    });
  }
}
