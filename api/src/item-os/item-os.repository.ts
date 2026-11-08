import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemOsDto } from '@/type/itemOs.dto';
import { subtotal } from './regras-item-os';

type Transacao = Prisma.TransactionClient;

@Injectable()
export class ItemOsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // cria o item e já atualiza o vl_total da OS na mesma transação,
  // senão o valor da OS fica diferente da soma dos itens
  registrar(dto: ItemOsDto) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.itensOs.create({
        data: {
          numOs: dto.numOs,
          tipo: dto.tipo,
          descricao: dto.descricao.trim(),
          quantidade: dto.quantidade,
          valorUnitario: dto.valorUnitario,
        },
      });

      await this.recalcularTotal(tx, dto.numOs);
      return item;
    });
  }

  remover(idItemOs: number, numOs: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.itensOs.delete({ where: { idItemOs } });
      await this.recalcularTotal(tx, numOs);
    });
  }

  private async recalcularTotal(tx: Transacao, numOs: number) {
    const itens = await tx.itensOs.findMany({
      where: { numOs },
      select: { quantidade: true, valorUnitario: true },
    });

    const total = itens.reduce(
      (soma, item) => soma.plus(subtotal(item.quantidade, item.valorUnitario)),
      new Prisma.Decimal(0),
    );

    await tx.ordemServico.update({
      where: { numOs },
      data: { vlTotal: total },
    });
  }

  findOsByNumAndCompany(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
    });
  }

  // traz junto o total e os pagamentos da O.S. pra validar a remoção
  findItemDaEmpresa(idItemOs: number, cnpjEmpresa: string) {
    return this.prisma.itensOs.findFirst({
      where: { idItemOs, ordemServico: { cnpjEmpresa } },
      include: {
        ordemServico: {
          select: {
            status: true,
            vlTotal: true,
            pagamentos: { select: { valorPago: true } },
          },
        },
      },
    });
  }

  findByNumOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.itensOs.findMany({
      where: {
        numOs,
        ordemServico: { cnpjEmpresa },
      },
      orderBy: { idItemOs: 'asc' },
    });
  }
}