import { Injectable } from '@nestjs/common';
import { ServicoDto } from './dto/service.dto';
import { PrismaService } from '@/prisma/prisma.service';

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
        return this.prisma.servico.update({ where: { idServico: id, AND:{cnpjEmpresa }}, data: dto });
    }

    findByIdServico(idServico: number, cnpjEmpresa: string) {
        return this.prisma.servico.findFirst({ where: { idServico: idServico, AND:{cnpjEmpresa }} });
    }
}