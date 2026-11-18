// o token mora aqui (e não no authService) porque o api.ts também precisa dele,
// e o authService importa o api.ts: ficaria um importando o outro

const TOKEN_KEY = "token";

export function obterToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

// apaga dos dois lugares: o token pode estar em qualquer um, dependendo do "lembrar-me"
export function removerToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function salvarToken(token: string, lembrar: boolean) {
  // limpa antes de salvar. sem isso, se o dono entrou com "lembrar-me" e depois
  // um técnico entra sem marcar, o token do dono continuava no localStorage
  // e era ele que ia nas requisições
  removerToken();

  if (lembrar) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function lembrouDoLogin() {
  return localStorage.getItem(TOKEN_KEY) !== null;
}

export function expiracaoDoToken(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export function tokenVencido(token: string) {
  const expiracao = expiracaoDoToken(token);
  return expiracao !== null && Date.now() >= expiracao;
}

export type MotivoSaida = "expirada" | "inatividade" | "saiu";

// usado no botão "Sair" e quando a sessão expira.
// recarrega a página de propósito: assim nenhum dado do usuário anterior fica na memória
export function sairDoSistema(motivo?: MotivoSaida) {
  removerToken();
  window.location.replace(motivo ? `/?sessao=${motivo}` : "/");
}