import { ValidationOptions, registerDecorator } from 'class-validator';

const PESOS_PRIMEIRO_DIGITO = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_SEGUNDO_DIGITO = [6, ...PESOS_PRIMEIRO_DIGITO];

function digitoVerificador(base: string, pesos: number[]) {
  const soma = [...base].reduce(
    (total, caractere, i) => total + (caractere.charCodeAt(0) - 48) * pesos[i],
    0,
  );
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cnpjValido(cnpj: unknown): boolean {
  if (typeof cnpj !== 'string') return false;
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(.)\1+$/.test(cnpj)) return false;

  const base = cnpj.slice(0, 12);
  const primeiro = digitoVerificador(base, PESOS_PRIMEIRO_DIGITO);
  const segundo = digitoVerificador(base + primeiro, PESOS_SEGUNDO_DIGITO);

  return cnpj.endsWith(`${primeiro}${segundo}`);
}

export function IsCnpj(options?: ValidationOptions) {
  return (objeto: object, propriedade: string) =>
    registerDecorator({
      name: 'isCnpj',
      target: objeto.constructor,
      propertyName: propriedade,
      options: { message: 'CNPJ inválido.', ...options },
      validator: { validate: cnpjValido },
    });
}
