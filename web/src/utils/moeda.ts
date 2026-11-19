const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarMoeda(valor: number): string {
  return formatador.format(Number.isFinite(valor) ? valor : 0);
}

// "1.500" e "1.500.000": pontos separando grupos de 3 números são milhar
const SO_MILHAR_COM_PONTO = /^\d{1,3}(\.\d{3})+$/;

function arredondarCentavos(valor: number) {
  return Math.round(valor * 100) / 100;
}

// aceita o que o usuário digita e o que vem do banco:
//   "1.500"    -> 1500     (ponto de milhar, sem vírgula)
//   "1.500,00" -> 1500     (padrão brasileiro)
//   "10,5"     -> 10.5
//   "10.50"    -> 10.5     (ponto como decimal, que é como a API devolve)
// sempre com no máximo 2 casas decimais
export function paraNumero(valor: string | number | null | undefined): number {
  if (valor === null || valor === undefined || valor === "") return 0;
  if (typeof valor === "number") return Number.isFinite(valor) ? arredondarCentavos(valor) : 0;

  const texto = valor.replace(/[R$\s]/g, "");
  let normalizado: string;

  if (texto.includes(",")) {
    // tem vírgula: ela é o decimal e todo ponto é milhar
    normalizado = texto.replace(/\./g, "").replace(",", ".");
  } else if (SO_MILHAR_COM_PONTO.test(texto)) {
    normalizado = texto.replace(/\./g, "");
  } else {
    normalizado = texto;
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? arredondarCentavos(numero) : 0;
}

export function valorEmTexto(valor: number): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MAXIMO_DIGITOS = 11;

export function mascaraValor(texto: string): string {
  const digitos = texto.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAXIMO_DIGITOS);
  if (!digitos) return "";
  return valorEmTexto(Number(digitos) / 100);
}