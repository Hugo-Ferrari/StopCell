import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarcaDto } from './dto/mark.dto';

@Injectable()
export class MarcaRepository {
    constructor(private readonly prisma: PrismaService) { }

    cadastro(dto: MarcaDto,) {
        return this.prisma.marca.create({
            data: dto
        });
    }

    findByMarcaNome(nome: string) {
        return this.prisma.marca.findMany({
            where: {
                nmMarca: nome,
            }
        });
    }

    atualizar(id: number, dto: MarcaDto) {

        return this.prisma.marca.update({
            where: {
                idMarca: id
            },
            data: dto
        })

    }

    findByid(id: number) {
        return this.prisma.marca.findFirst({
            where: {
                idMarca: id,
            },
        });
    }
}