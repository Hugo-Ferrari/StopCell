// pega as iniciais pro "avatar" (Yasmim Ferreira -> YF)
export function iniciais(nome: string | null) {
  if (!nome) return "?";
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}
