const somenteNumeros = (valor: string) => valor.replace(/\D/g, "");

// Aplica máscara de CNPJ progressivamente: 00.000.000/0000-00
export function formatarCnpj(valor: string): string {
  const numeros = somenteNumeros(valor).slice(0, 14);

  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

// Aplica máscara de telefone progressivamente:
// (00) 0000-0000  (fixo, 10 dígitos) ou (00) 00000-0000 (celular, 11 dígitos)
export function formatarTelefone(valor: string): string {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}