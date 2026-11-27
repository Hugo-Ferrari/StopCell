import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


function daLojaOuPadrao(cnpjEmpresa: string): Prisma.MarcaWhereInput {
  return { OR: [{ cnpjEmpresa: null }, { cnpjEmpresa }] };
}

@Injectable()
export class MarcaRepository {
  constructor(private readonly prisma: PrismaService) {}

  cadastro(nmMarca: string, cnpjEmpresa: string) {
    return this.prisma.marca.create({ data: { nmMarca, cnpjEmpresa } });
  }

  atualizar(idMarca: number, nmMarca: string) {
    return this.prisma.marca.update({ where: { idMarca }, data: { nmMarca } });
  }

  findByid(idMarca: number) {
    return this.prisma.marca.findUnique({ where: { idMarca } });
  }


  findVisivelPorNome(nome: string, cnpjEmpresa: string) {
    return this.prisma.marca.findFirst({
      where: { ...daLojaOuPadrao(cnpjEmpresa), nmMarca: { equals: nome, mode: 'insensitive' } },
    });
  }

  buscarPorNome(nome: string, cnpjEmpresa: string) {
    return this.prisma.marca.findMany({
      where: { ...daLojaOuPadrao(cnpjEmpresa), nmMarca: { contains: nome, mode: 'insensitive' } },
      orderBy: { idMarca: 'asc' },
    });
  }
}