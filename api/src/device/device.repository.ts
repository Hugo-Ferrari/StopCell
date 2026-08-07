import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AparelhoDto } from './dto/device.dto';

@Injectable()
export class AparelhoRepository {
    constructor(private readonly prisma: PrismaService) {}

    cadastro(dto: AparelhoDto) {
        return this.prisma.aparelho.create({
            data: dto,
        });
    }

    atualizar(id: string, dto: AparelhoDto) {
        return this.prisma.aparelho.update({
            where: {
                imei: id,
            },
            data: dto,
        });
    }
    findById(id: string) {
        return this.prisma.aparelho.findFirst({
            where: {
                imei: id,
                cliente: {
                    
                },
            },
        });
    }

    listar() {
        return this.prisma.aparelho.findMany({
            where: {
                cliente: {
                    
                },
            },
        });
    }

    listarPorCliente(cpfCliente: string) {
        return this.prisma.aparelho.findMany({
            where: {
                cpfCliente,
            },
        });
    }
}