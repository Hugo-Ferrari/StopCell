import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiagnosticoDto } from './dto/diagnostico.dto';

@Injectable()
export class DiagnosticoRepository {
    constructor(private readonly prisma: PrismaService) {}

    cadastrar(dto: DiagnosticoDto) {
        return this.prisma.diagnostico.create({
            data: {
                numOs: dto.numOs,
                relatoTecnico: dto.relatoTecnico,
                dataHora: new Date(),
            },
        });
    }
}