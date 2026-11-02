// Mesmas chaves do back (api/src/common/permissoes/catalogo.ts).
// Se criar uma permissão nova lá, adicione aqui também.
export const PERMISSOES = {
  ORDENS_VER: "ordens.ver",
  ORDENS_EDITAR: "ordens.editar",
  HISTORICO_VER: "historico.ver",
  ESTOQUE_VER: "estoque.ver",
  ESTOQUE_EDITAR: "estoque.editar",
  FINANCEIRO_VER: "financeiro.ver",
  LOJA_EDITAR: "loja.editar",
} as const;

export type Permissao = (typeof PERMISSOES)[keyof typeof PERMISSOES];

// marcar "editar" marca "ver" junto (o back faz a mesma coisa)
export const DEPENDENCIAS: Record<string, string> = {
  [PERMISSOES.ORDENS_EDITAR]: PERMISSOES.ORDENS_VER,
  [PERMISSOES.ESTOQUE_EDITAR]: PERMISSOES.ESTOQUE_VER,
};

export function alternarPermissao(atuais: string[], chave: string): string[] {
  const set = new Set(atuais);

  if (set.has(chave)) {
    set.delete(chave);
    // tirou o "ver"? tira o "editar" que depende dele
    for (const [editar, ver] of Object.entries(DEPENDENCIAS)) {
      if (ver === chave) set.delete(editar);
    }
  } else {
    set.add(chave);
    if (DEPENDENCIAS[chave]) set.add(DEPENDENCIAS[chave]);
  }

  return [...set];
}