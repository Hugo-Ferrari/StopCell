import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemOsDto } from './dto/itemOs.dto';

@Injectable()
export class ItenOsRepository {
    constructor(private readonly prisma: PrismaService) {}

    registrar(dto: ItemOsDto) {
        return this.prisma.itensOs.create({
            data: {
                numOs: dto.numOs,
                idServico: dto.idServico,
                idPeca: dto.idPeca,
                quantidade: dto.quantidade,
                valorUnitario: dto.valorUnitario,
            },
        });
    }

    findOsByNumAndCompany(numOs: number, cnpjEmpresa: string) {
        return this.prisma.ordemServico.findFirst({
            where: { numOs, cnpjEmpresa },
        });
    }

    findByNumOs(numOs: number, cnpjEmpresa: string) {
        return this.prisma.itensOs.findMany({
            where: {
                numOs,
                ordemServico: { cnpjEmpresa },
            },
        });
    }
}