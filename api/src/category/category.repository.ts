import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categoriaDto } from './dto/category.dto';

@Injectable()
export class categoriaRepository {
    constructor(private readonly prisma: PrismaService) {}
// adicionar ligação entre categoria e empresa no PRISMA
    cadastro(dto: categoriaDto) {
        return this.prisma.categoria.create({data: dto,});
    }

    findByid(id: number, ) {
        return this.prisma.categoria.findFirst({ where: {idCategoria: id},});
    }

    atualizar(id: number, dto: categoriaDto, ) {
        return this.prisma.categoria.update({
            where: {
                idCategoria: id,
            },
            data: dto,
        });
    }
}