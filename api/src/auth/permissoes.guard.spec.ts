import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissoesGuard } from './permissoes.guard';
import { PrismaService } from '@/prisma/prisma.service';

describe('PermissoesGuard - troca de senha', () => {
  const senhaAlteradaEm = new Date('2026-11-25T12:00:00.000Z');
  const segundosDaTroca = Math.floor(senhaAlteradaEm.getTime() / 1000);

  let prisma: { usuario: { findUnique: jest.Mock } };
  let guard: PermissoesGuard;

  function contexto(user: Record<string, unknown>) {
    const request = { user };
    return {
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    prisma = { usuario: { findUnique: jest.fn() } };
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) };
    guard = new PermissoesGuard(reflector as unknown as Reflector, prisma as unknown as PrismaService);
  });

  it('libera token de quem nunca trocou a senha', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      ativo: true,
      nivelAcesso: 'Dono',
      senhaAlteradaEm: null,
      perfil: null,
    });

    await expect(guard.canActivate(contexto({ sub: 1, iat: 100 }))).resolves.toBe(true);
  });

  it('recusa token emitido antes da troca de senha', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      ativo: true,
      nivelAcesso: 'Dono',
      senhaAlteradaEm,
      perfil: null,
    });

    await expect(
      guard.canActivate(contexto({ sub: 1, iat: segundosDaTroca - 1 })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('libera token emitido depois da troca de senha', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      ativo: true,
      nivelAcesso: 'Dono',
      senhaAlteradaEm,
      perfil: null,
    });

    await expect(
      guard.canActivate(contexto({ sub: 1, iat: segundosDaTroca })),
    ).resolves.toBe(true);
  });

  it('recusa token sem data de emissão quando a senha já foi trocada', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      ativo: true,
      nivelAcesso: 'Dono',
      senhaAlteradaEm,
      perfil: null,
    });

    await expect(guard.canActivate(contexto({ sub: 1 }))).rejects.toThrow(UnauthorizedException);
  });
});
