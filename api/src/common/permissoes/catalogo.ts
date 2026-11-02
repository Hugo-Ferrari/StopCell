// Lista de tudo que dá pra liberar ou bloquear para um funcionário.
// Se criar uma tela nova no sistema, adicione a permissão dela aqui
// e o front já mostra a opção na tela de perfis.

export const PERMISSOES = {
  ORDENS_VER: 'ordens.ver',
  ORDENS_EDITAR: 'ordens.editar',
  HISTORICO_VER: 'historico.ver',
  ESTOQUE_VER: 'estoque.ver',
  ESTOQUE_EDITAR: 'estoque.editar',
  FINANCEIRO_VER: 'financeiro.ver',
  LOJA_EDITAR: 'loja.editar',
} as const;

export type Permissao = (typeof PERMISSOES)[keyof typeof PERMISSOES];

export const NIVEL_DONO = 'Dono';
export const NIVEL_FUNCIONARIO = 'Funcionario';

export const CATALOGO_PERMISSOES = [
  {
    chave: PERMISSOES.ORDENS_VER,
    grupo: 'Ordens de Serviço',
    nome: 'Visualizar ordens',
    descricao: 'Ver ordens de serviço, clientes e aparelhos',
  },
  {
    chave: PERMISSOES.ORDENS_EDITAR,
    grupo: 'Ordens de Serviço',
    nome: 'Abrir e editar ordens',
    descricao: 'Abrir OS, cadastrar clientes e aparelhos, diagnóstico, checklist e receber pagamento',
  },
  {
    chave: PERMISSOES.HISTORICO_VER,
    grupo: 'Histórico',
    nome: 'Visualizar histórico',
    descricao: 'Consultar serviços já realizados',
  },
  {
    chave: PERMISSOES.ESTOQUE_VER,
    grupo: 'Estoque',
    nome: 'Visualizar estoque',
    descricao: 'Ver peças e quantidades',
  },
  {
    chave: PERMISSOES.ESTOQUE_EDITAR,
    grupo: 'Estoque',
    nome: 'Gerenciar estoque',
    descricao: 'Cadastrar e alterar peças e serviços',
  },
  {
    chave: PERMISSOES.FINANCEIRO_VER,
    grupo: 'Financeiro',
    nome: 'Acessar financeiro',
    descricao: 'Ver pagamentos recebidos e despesas da loja',
  },
  {
    chave: PERMISSOES.LOJA_EDITAR,
    grupo: 'Configurações',
    nome: 'Editar dados da loja',
    descricao: 'Alterar nome, telefone e endereço da loja',
  },
];

export const TODAS_PERMISSOES: string[] = CATALOGO_PERMISSOES.map((p) => p.chave);

// quem pode editar precisa conseguir ver, senão a tela nem abre
const DEPENDENCIAS: Record<string, string> = {
  [PERMISSOES.ORDENS_EDITAR]: PERMISSOES.ORDENS_VER,
  [PERMISSOES.ESTOQUE_EDITAR]: PERMISSOES.ESTOQUE_VER,
};

export function normalizarPermissoes(permissoes: string[]): string[] {
  const resultado = new Set(permissoes);
  for (const p of permissoes) {
    if (DEPENDENCIAS[p]) resultado.add(DEPENDENCIAS[p]);
  }
  // mantém a mesma ordem do catálogo
  return TODAS_PERMISSOES.filter((p) => resultado.has(p));
}