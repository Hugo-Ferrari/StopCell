import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarcaDto } from './dto/marca.dto';

@Injectable()
export class MarcaRepository {
    constructor(private readonly prisma: PrismaService) {}

    cadastro(dto: MarcaDto & { cnpjEmpresa: string }) {
        return this.prisma.marca.create({
            data: {
                ...dto,
                cnpjEmpresa: dto.cnpjEmpresa,
            },
        });
    }

    findByMarcaNome(nome: string, cnpjEmpresa: string) {
        return this.prisma.marca.findMany({ where: { nmMarca: nome, cnpjEmpresa } });
    }

    atualizar(id: number, dto: MarcaDto, cnpjEmpresa: string) {
        return this.prisma.marca.update({ where: { idMarca: id, cnpjEmpresa }, data: dto });
    }

    findByid(id: number, cnpjEmpresa: string) {
        return this.prisma.marca.findFirst({ where: { idMarca: id, cnpjEmpresa } });
    }
}