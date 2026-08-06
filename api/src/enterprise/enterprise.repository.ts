
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmpresaDto } from './dto/enterprise.dto';

@Injectable()
export class EmpresaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCnpj(cnpj: string) {
    return this.prisma.empresa.findUnique({ where: { cnpj } });
  }

  create(dto: EmpresaDto) {
    return this.prisma.empresa.create({ data: dto });
  }

  update(cnpj: string, dto: EmpresaDto) {
    return this.prisma.empresa.update({ where: { cnpj }, data: dto });
  }
}