import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { PERMISSAO_KEY, SOMENTE_DONO_KEY } from '@/common/decorators/permissao.decorator';
import { NIVEL_DONO, TODAS_PERMISSOES } from '@/common/permissoes/catalogo';

// Roda depois do JwtAuthGuard, então o request.user já está preenchido.
@Injectable()
export class PermissoesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const alvos = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, alvos);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const idUsuario = Number(request.user?.sub);

    if (!Number.isInteger(idUsuario)) {
      throw new UnauthorizedException('Token inválido');
    }

    // busca no banco a cada requisição: assim, se o dono mudar o perfil
    // ou desativar alguém, vale na hora, sem esperar o token expirar
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario },
      select: {
        ativo: true,
        nivelAcesso: true,
        perfil: { select: { permissoes: true } },
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Usuário desativado');
    }

    const ehDono = usuario.nivelAcesso === NIVEL_DONO;
    request.ehDono = ehDono;
    request.permissoes = ehDono ? TODAS_PERMISSOES : (usuario.perfil?.permissoes ?? []);

    const somenteDono = this.reflector.getAllAndOverride<boolean>(SOMENTE_DONO_KEY, alvos);
    if (somenteDono && !ehDono) {
      throw new ForbiddenException('Apenas o administrador da loja pode fazer isso.');
    }

    const exigidas = this.reflector.getAllAndOverride<string[]>(PERMISSAO_KEY, alvos);
    if (!exigidas?.length || ehDono) return true;

    const temAlguma = exigidas.some((p) => request.permissoes.includes(p));
    if (!temAlguma) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }

    return true;
  }
}