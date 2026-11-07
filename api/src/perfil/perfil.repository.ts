import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PerfilRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(cnpjEmpresa: string) {
    return this.prisma.perfilAcesso.findMany({
      where: { cnpjEmpresa },
      orderBy: { nome: 'asc' },
      include: { _count: { select: { usuarios: true } } },
    });
  }

  buscarPorId(idPerfil: number, cnpjEmpresa: string) {
    return this.prisma.perfilAcesso.findFirst({ where: { idPerfil, cnpjEmpresa } });
  }

  criar(data: { cnpjEmpresa: string; nome: string; descricao?: string; permissoes: string[] }) {
    return this.prisma.perfilAcesso.create({ data });
  }

  atualizar(idPerfil: number, data: { nome?: string; descricao?: string; permissoes?: string[] }) {
    return this.prisma.perfilAcesso.update({ where: { idPerfil }, data });
  }

  contarUsuarios(idPerfil: number) {
    return this.prisma.usuario.count({ where: { idPerfil } });
  }

  remover(idPerfil: number) {
    return this.prisma.perfilAcesso.delete({ where: { idPerfil } });
  }
}