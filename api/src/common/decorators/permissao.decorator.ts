import { SetMetadata } from '@nestjs/common';
import type { Permissao as ChavePermissao } from '@/common/permissoes/catalogo';

export const PERMISSAO_KEY = 'permissoes';
export const SOMENTE_DONO_KEY = 'somenteDono';

// Basta o usuário ter UMA das permissões passadas.
// Ex: @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
export const Permissao = (...permissoes: ChavePermissao[]) =>
  SetMetadata(PERMISSAO_KEY, permissoes);

// Rotas que só o dono da loja pode usar (ex: gerenciar usuários e perfis)
export const SomenteDono = () => SetMetadata(SOMENTE_DONO_KEY, true);