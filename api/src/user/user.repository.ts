import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

// nunca devolve a senha pro front
const CAMPOS_PUBLICOS = {
  idUsuario: true,
  nome: true,
  login: true,
  emailUsuario: true,
  nivelAcesso: true,
  ativo: true,
  perfil: { select: { idPerfil: true, nome: true, permissoes: true } },
} satisfies Prisma.UsuarioSelect;

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  // usado no login, por isso traz a senha
  findByEmail(emailUsuario: string) {
    return this.prisma.usuario.findFirst({ where: { emailUsuario } });
  }

  buscarPorId(idUsuario: number) {
    return this.prisma.usuario.findUnique({ where: { idUsuario }, select: CAMPOS_PUBLICOS });
  }

  buscarDaEmpresa(idUsuario: number, cnpjEmpresa: string) {
    return this.prisma.usuario.findFirst({
      where: { idUsuario, cnpjEmpresa },
      select: CAMPOS_PUBLICOS,
    });
  }

  listarDaEmpresa(cnpjEmpresa: string) {
    return this.prisma.usuario.findMany({
      where: { cnpjEmpresa },
      // dono primeiro, depois por nome
      orderBy: [{ nivelAcesso: 'asc' }, { nome: 'asc' }],
      select: CAMPOS_PUBLICOS,
    });
  }

  criar(data: Prisma.UsuarioUncheckedCreateInput) {
    return this.prisma.usuario.create({ data, select: CAMPOS_PUBLICOS });
  }

  atualizar(idUsuario: number, data: Prisma.UsuarioUncheckedUpdateInput) {
    return this.prisma.usuario.update({ where: { idUsuario }, data, select: CAMPOS_PUBLICOS });
  }
}