import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// o que a loja enxerga: as categorias padrão (sem loja) e as que ela mesma criou
function daLojaOuPadrao(cnpjEmpresa: string): Prisma.CategoriaWhereInput {
  return { OR: [{ cnpjEmpresa: null }, { cnpjEmpresa }] };
}

@Injectable()
export class categoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  cadastro(nmCategoria: string, cnpjEmpresa: string) {
    return this.prisma.categoria.create({ data: { nmCategoria, cnpjEmpresa } });
  }

  atualizar(idCategoria: number, nmCategoria: string) {
    return this.prisma.categoria.update({ where: { idCategoria }, data: { nmCategoria } });
  }

  findByid(idCategoria: number) {
    return this.prisma.categoria.findUnique({ where: { idCategoria } });
  }

  findVisivelPorNome(nome: string, cnpjEmpresa: string) {
    return this.prisma.categoria.findFirst({
      where: { ...daLojaOuPadrao(cnpjEmpresa), nmCategoria: { equals: nome, mode: 'insensitive' } },
    });
  }
}