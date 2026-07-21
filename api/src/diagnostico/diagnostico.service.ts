import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiagnosticoRepository } from './diagnostico.repository';
import { DiagnosticoDto } from './dto/diagnostico.dto';

@Injectable()
export class DiagnosticoService {
    constructor(
        private readonly repository: DiagnosticoRepository,
        private readonly prisma: PrismaService,
    ) {}

    async cadastrar(dto: DiagnosticoDto, cnpjEmpresa: string) {
        const ordemServico = await this.prisma.ordemServico.findFirst({
            where: { numOs: dto.numOs, cnpjEmpresa },
        });

        if (!ordemServico) {
            throw new NotFoundException('Ordem de serviço não encontrada para esta empresa');
        }

        return await this.repository.cadastrar(dto);
    }
}