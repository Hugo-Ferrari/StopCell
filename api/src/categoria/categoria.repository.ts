import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categoriaDto } from './dto/categoria.dto';

@Injectable()
export class categoriaRepository {
    constructor(private readonly prisma: PrismaService) {}

    cadastro(dto: categoriaDto & { cnpjEmpresa: string }) {
        return this.prisma.categoria.create({
            data: {
                ...dto,
                cnpjEmpresa: dto.cnpjEmpresa,
            },
        });
    }

    findByid(id: number, cnpjEmpresa: string) {
        return this.prisma.categoria.count({ where: { idCategoria: id, cnpjEmpresa } });
    }

    atualizar(id: number, dto: categoriaDto, cnpjEmpresa: string) {
        return this.prisma.categoria.update({ where: { idCategoria: id, cnpjEmpresa }, data: dto });
    }
}