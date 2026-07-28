import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AparelhoDto } from './dto/aparelho.dto';

@Injectable()
export class AparelhoRepository {
    constructor(private readonly prisma: PrismaService) {}

    cadastro(dto: AparelhoDto & { cnpjEmpresa: string }) {
        return this.prisma.aparelho.create({
            data: {
                ...dto,
                cnpjEmpresa: dto.cnpjEmpresa,
            },
        });
    }

    atualizar(id: string, dto: AparelhoDto, cnpjEmpresa: string) {
        return this.prisma.aparelho.update({ where: { imei: id, cnpjEmpresa }, data: dto });
    }

    findById(id: string, cnpjEmpresa: string) {
        return this.prisma.aparelho.count({ where: { imei: id, cnpjEmpresa } });
    }
    listar(cnpjEmpresa: string){
        return this.prisma.aparelho.findMany({where:{cnpjEmpresa}})
    }
}
