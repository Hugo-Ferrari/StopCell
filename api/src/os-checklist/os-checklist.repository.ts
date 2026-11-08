import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemChecklistOsDto } from '@/type/os-checklist.dto';

@Injectable()
export class OsChecklistRepository {
    constructor(private readonly prisma: PrismaService) {}

    findByOrdemEChecklist(numOs: number, idChecklist: number, cnpjEmpresa: string) {
        return this.prisma.osChecklist.findFirst({
            where: {
                numOs,
                idChecklist,
                ordemServico: { cnpjEmpresa },
            },
        });
    }

    atualizarStatus(numOs: number, idChecklist: number, status: string, cnpjEmpresa: string) {
        return this.prisma.osChecklist.updateMany({
            where: {
                numOs,
                idChecklist,
                ordemServico: { cnpjEmpresa },
            },
            data: { status },
        });
    }

    findOs(numOs: number, cnpjEmpresa: string) {
        return this.prisma.ordemServico.findFirst({
            where: { numOs, cnpjEmpresa },
            select: { numOs: true },
        });
    }

    listarPorOs(numOs: number, cnpjEmpresa: string) {
        return this.prisma.osChecklist.findMany({
            where: { numOs, ordemServico: { cnpjEmpresa } },
            include: { checklist: { select: { descricao: true } } },
            orderBy: { idChecklist: 'asc' },
        });
    }

    salvar(numOs: number, cnpjEmpresa: string, itens: ItemChecklistOsDto[]) {
        return this.prisma.$transaction(async (tx) => {
            const idsMantidos: number[] = [];

            for (const item of itens) {
                // a tabela checklist é o catálogo de itens da loja. o primeiro uso de
                // um item novo já cadastra ele lá, assim não precisa de tela pra isso
                const existente = await tx.checklist.findFirst({
                    where: { cnpjEmpresa, descricao: item.descricao },
                    select: { idChecklist: true },
                });

                const idChecklist =
                    existente?.idChecklist ??
                    (
                        await tx.checklist.create({
                            data: { cnpjEmpresa, descricao: item.descricao },
                            select: { idChecklist: true },
                        })
                    ).idChecklist;

                await tx.osChecklist.upsert({
                    where: { numOs_idChecklist: { numOs, idChecklist } },
                    create: { numOs, idChecklist, status: item.status, observacao: item.observacao ?? null },
                    update: { status: item.status, observacao: item.observacao ?? null },
                });

                idsMantidos.push(idChecklist);
            }

            await tx.osChecklist.deleteMany({
                where: { numOs, idChecklist: { notIn: idsMantidos } },
            });

            return tx.osChecklist.findMany({
                where: { numOs },
                include: { checklist: { select: { descricao: true } } },
                orderBy: { idChecklist: 'asc' },
            });
        });
    }
}