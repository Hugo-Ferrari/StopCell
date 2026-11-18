const somenteNumeros = (valor: string) => valor.replace(/\D/g, "");

// CNPJ novo pode ter letra nas 12 primeiras posições.
// os 2 últimos, que são os dígitos verificadores, continuam sendo só número
export function limparCnpj(valor: string): string {
  const bruto = valor.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const base = bruto.slice(0, 12);
  const digitos = bruto.slice(12).replace(/\D/g, "").slice(0, 2);
  return base + digitos;
}

// 12.ABC.345/01DE-35 ou 11.222.333/0001-81, montando conforme digita
export function formatarCnpj(valor: string): string {
  const cnpj = limparCnpj(valor);
  const [a, b, c, d, e] = [cnpj.slice(0, 2), cnpj.slice(2, 5), cnpj.slice(5, 8), cnpj.slice(8, 12), cnpj.slice(12, 14)];

  let texto = a;
  if (b) texto += `.${b}`;
  if (c) texto += `.${c}`;
  if (d) texto += `/${d}`;
  if (e) texto += `-${e}`;
  return texto;
}

// 000.000.000-00, montando conforme digita
export function formatarCpf(valor: string): string {
  const numeros = somenteNumeros(valor).slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

// (00) 0000-0000 pra fixo ou (00) 00000-0000 pra celular
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

// 00000-000
export function formatarCep(valor: string): string {
  const numeros = somenteNumeros(valor).slice(0, 8);
  return numeros.replace(/^(\d{5})(\d)/, "$1-$2");
}