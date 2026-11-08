import type { AparelhoDoCliente } from "@/services/deviceService";

export const TIPOS_SENHA = ["Numérica (PIN)", "Alfanumérica", "Padrão (Desenho)", "Sem Senha", "Não Informada"];

// o cadastro antigo salvava esses textos quando o campo ficava vazio.
// na hora de preencher o formulário de novo, eles voltam a ser campo vazio
const TEXTOS_DE_VAZIO = ["Não informado", "Não informada", "Não possui"];

export function semTextoDeVazio(valor: string | null | undefined) {
  if (!valor || TEXTOS_DE_VAZIO.includes(valor)) return "";
  return valor;
}

export function nomeDoAparelho(aparelho: AparelhoDoCliente) {
  const modelo = semTextoDeVazio(aparelho.modelo);
  return [aparelho.marca?.nmMarca, modelo].filter(Boolean).join(" ") || "Aparelho sem modelo";
}

export function pedeSenhaDigitada(tipoSenha: string) {
  return tipoSenha === "Numérica (PIN)" || tipoSenha === "Alfanumérica";
}