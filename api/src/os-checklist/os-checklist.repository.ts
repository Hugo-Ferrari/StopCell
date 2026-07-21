import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}