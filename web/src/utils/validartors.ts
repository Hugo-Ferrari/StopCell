export function emailValido(email: string): boolean {
  // exige um @ e um domínio com ponto depois, tipo @gmail.com
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// recebe só os números. 111.111.111-11 passa na conta mas não existe, por isso a 2ª checagem
export function cpfValido(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;

  const digito = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

// vale pro CNPJ antigo (só número) e pro novo com letras.
// a conta é a mesma de sempre, mas cada caractere vale o código dele menos 48:
// "0" a "9" continuam valendo 0 a 9, "A" vale 17, "B" vale 18...
export function cnpjValido(cnpj: string): boolean {
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(.)\1+$/.test(cnpj)) return false;

  const valor = (c: string) => c.charCodeAt(0) - 48;
  const digito = (base: string, pesos: number[]) => {
    const soma = [...base].reduce((total, c, i) => total + valor(c) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, ...pesos1];
  const d1 = digito(cnpj.slice(0, 12), pesos1);
  const d2 = digito(cnpj.slice(0, 12) + d1, pesos2);

  return cnpj.endsWith(`${d1}${d2}`);
}

// fixo tem 10 números com DDD, celular tem 11
export function telefoneValido(numeros: string): boolean {
  return /^\d{10,11}$/.test(numeros);
}

// conta de Luhn: o último número do IMEI confere os 14 anteriores
export function imeiValido(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false;

  let soma = 0;
  for (let i = 0; i < 15; i++) {
    let numero = Number(imei[i]);
    if (i % 2 === 1) {
      numero *= 2;
      if (numero > 9) numero -= 9;
    }
    soma += numero;
  }
  return soma % 10 === 0;
}

export function limparImei(valor: string): string {
  return valor.trim().replace(/[\s-]/g, "");
}

// celular sempre tem IMEI. tablet pode ter (com chip) ou não (só wi-fi)
export function categoriaExigeImei(categoria: string): boolean {
  return /smartphone|celular/i.test(categoria);
}

// devolve a mensagem de erro, ou null se estiver ok
export function erroDoImei(valor: string, categoria: string): string | null {
  const limpo = limparImei(valor);
  if (!limpo) return "Informe o IMEI ou número de série.";

  const soNumeros = /^\d+$/.test(limpo);

  if (categoriaExigeImei(categoria)) {
    if (!soNumeros || limpo.length !== 15) return "O IMEI tem 15 números. Disque *#06# no aparelho pra ver.";
    if (!imeiValido(limpo)) return "Esse IMEI não existe. Confira os números.";
    return null;
  }

  // tablet com chip: se digitaram 15 números, é IMEI e dá pra conferir
  if (/tablet/i.test(categoria) && soNumeros && limpo.length === 15 && !imeiValido(limpo)) {
    return "Esse IMEI não existe. Confira os números.";
  }

  if (limpo.length < 4) return "Número de série muito curto.";
  return null;
}