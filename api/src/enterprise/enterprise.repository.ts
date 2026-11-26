import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateEmpresaDTO } from '@/type/enterprise.dto';

@Injectable()
export class EmpresaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCnpj(cnpj: string) {
    return this.prisma.empresa.findUnique({ where: { cnpj } });
  }

  update(cnpj: string, dto: UpdateEmpresaDTO) {
  return this.prisma.empresa.update({ where: { cnpj }, data: dto });
}
}
