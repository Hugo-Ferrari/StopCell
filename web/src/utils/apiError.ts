import { isAxiosError } from "axios";

export function mensagemDeErro(error: unknown, padrao: string): string {
  if (!isAxiosError(error)) return padrao;

  const message = error.response?.data?.message;

  if (Array.isArray(message)) return message.join("\n");
  if (typeof message === "string" && message.length > 0) return message;

  return padrao;
}