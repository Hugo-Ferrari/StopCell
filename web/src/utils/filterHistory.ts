import type { DateRange } from "react-day-picker";
import type { OrdemServicoInterface } from "@/pages/history/History";

// Deixa a busca sem diferenciar maiúsculas nem acentos ("joao" encontra "João")
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function dentroDoPeriodo(dtEntrada: string | null, periodo: DateRange | undefined) {
  if (!periodo?.from) return true;
  if (!dtEntrada) return false;

  const data = new Date(dtEntrada);
  const inicio = new Date(periodo.from);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(periodo.to ?? periodo.from);
  fim.setHours(23, 59, 59, 999);

  return data >= inicio && data <= fim;
}

export function filtrarOrdens(
  ordens: OrdemServicoInterface[],
  busca: string,
  periodo: DateRange | undefined
) {
  const termo = normalizar(busca.trim());

  return ordens.filter((os) => {
    if (!dentroDoPeriodo(os.dtEntrada, periodo)) return false;
    if (!termo) return true;

    return [String(os.numOs), os.cliente?.nmCompleto ?? "", os.aparelho?.modelo ?? ""]
      .some((campo) => normalizar(campo).includes(termo));
  });
}
