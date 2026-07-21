import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChecklistDto } from './dto/checklist.dto';

@Injectable()
export class ChecklistRepository {
    constructor(private readonly prisma: PrismaService) {}

    registrar(dto: ChecklistDto & { cnpjEmpresa: string }) {
        return this.prisma.checklist.create({
            data: {
                ...dto,
                cnpjEmpresa: dto.cnpjEmpresa,
            },
        });
    }

    existsById(id: number, cnpjEmpresa: string) {
        return this.prisma.checklist.count({ where: { idChecklist: id, cnpjEmpresa } });
    }

    atualizar(id: number, dto: ChecklistDto, cnpjEmpresa: string) {
        return this.prisma.checklist.update({
            where: { idChecklist: id, cnpjEmpresa },
            data: dto,
        });
    }
}