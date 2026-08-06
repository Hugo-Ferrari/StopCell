import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoDto } from './dto/service.dto';

@Injectable()
export class ServicoRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(dto: ServicoDto & { cnpjEmpresa: string }) {
        return this.prisma.servico.create({
            data: {
                ...dto,
                cnpjEmpresa: dto.cnpjEmpresa,
            },
        });
    }

    atualizar(id: number, dto: ServicoDto, cnpjEmpresa: string) {
        return this.prisma.servico.update({ where: { idServico: id, cnpjEmpresa }, data: dto });
    }

    findByIdServico(idServico: number, cnpjEmpresa: string) {
        return this.prisma.servico.findFirst({ where: { idServico: idServico, cnpjEmpresa } });
    }
}