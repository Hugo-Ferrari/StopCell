import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PecaDto } from './dto/peca.dto';

@Injectable()
export class PecaRepository {
    constructor(private readonly prisma: PrismaService) {}

    cadastro(dto: PecaDto & { cnpjEmpresa: string }) {
        return this.prisma.peca.create({
            data: {
                ...dto,
                cnpjEmpresa: dto.cnpjEmpresa,
            },
        });
    }

    atualizar(id: number, dto: PecaDto, cnpjEmpresa: string) {
        return this.prisma.peca.update({ where: { idPeca: id, AND:{cnpjEmpresa }}, data: dto });
    }

    findByIdPeca(id: number, cnpjEmpresa: string) {
        return this.prisma.peca.findFirst({ where: { idPeca: id, AND:{cnpjEmpresa } }});
    }

    findAll(cnpjEmpresa: string) {
        return this.prisma.peca.findMany({ where: { cnpjEmpresa,AND:{ quantidade: { gt: 0 } }} });
    }
}