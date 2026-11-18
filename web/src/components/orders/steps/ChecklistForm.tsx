import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import {
  CheckCircle2,
  ClipboardList,
  Loader2,
  MinusCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { buscarUltimaOsPorImei, type UltimaOsAparelho } from "@/services/serviceOrderService";
import { cn } from "@/lib/utils";

export const ITENS_CHECKLIST = [
  "Tela / Touch", "Botões", "Câmera frontal", "Câmera traseira",
  "Conector de carga", "Som / Alto-falante", "Microfone",
  "Wi-Fi / Rede", "Biometria / Face ID", "Bateria",
  "Avarias físicas", "Chip / SIM",
];

// garantia de serviço do Código de Defesa do Consumidor
const GARANTIA_DIAS = 90;

export type StatusItem = "OK" | "NOK" | "NA" | null;

export interface DadosChecklist {
  retrabalho: boolean;
  osAnterior: string;
  relato: string;
  itens: { nome: string; status: StatusItem; obs: string }[];
}

export function checklistVazio(): DadosChecklist {
  return {
    retrabalho: false,
    osAnterior: "",
    relato: "",
    itens: ITENS_CHECKLIST.map((nome) => ({ nome, status: null, obs: "" })),
  };
}

interface ChecklistFormProps {
  imeiAparelho: string;
  dadosChecklist: DadosChecklist;
  setDadosChecklist: Dispatch<SetStateAction<DadosChecklist>>;
}

const BOTOES_STATUS = [
  {
    valor: "OK" as const,
    texto: "OK",
    icone: CheckCircle2,
    ativo: "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-500",
  },
  {
    valor: "NOK" as const,
    texto: "NÃO OK",
    icone: XCircle,
    ativo: "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-500",
  },
  {
    valor: "NA" as const,
    texto: "N/A",
    icone: MinusCircle,
    ativo: "bg-muted-foreground/10 border-muted-foreground/50 text-foreground",
  },
];

function ResumoOsAnterior({ os }: { os: UltimaOsAparelho }) {
  const dias = os.dtSaida ? differenceInCalendarDays(new Date(), new Date(os.dtSaida)) : null;
  const naGarantia = dias !== null && dias <= GARANTIA_DIAS;
  const servicos = os.itensOs
    .map((item) => item.descricao)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3 text-sm">
        <RotateCcw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p>
            <span className="font-medium">O.S. #{os.numOs}</span>
            {os.dtSaida && (
              <span className="text-muted-foreground">
                {" "}
                · entregue em {format(new Date(os.dtSaida), "dd/MM/yyyy")} (
                {dias === 0 ? "hoje" : `${dias} dia${dias === 1 ? "" : "s"} atrás`})
              </span>
            )}
          </p>
          {servicos && <p className="truncate text-xs text-muted-foreground">{servicos}</p>}
        </div>

        {dias !== null && (
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
              naGarantia
                ? "bg-success/12 text-success"
                : "bg-amber-500/12 text-amber-700 dark:text-amber-400",
            )}
          >
            {naGarantia ? <ShieldCheck className="size-3.5" /> : <ShieldAlert className="size-3.5" />}
            {naGarantia ? "na garantia" : "fora da garantia"}
          </span>
        )}
      </div>

      {dias !== null && !naGarantia && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Já passou dos {GARANTIA_DIAS} dias de garantia do serviço. Dá pra marcar como retrabalho se a loja quiser
          cobrir mesmo assim.
        </p>
      )}
    </div>
  );
}

export default function ChecklistForm({ imeiAparelho, dadosChecklist, setDadosChecklist }: ChecklistFormProps) {
  const [ultimaOs, setUltimaOs] = useState<UltimaOsAparelho | null>(null);
  const [buscando, setBuscando] = useState(true);

  // só busca pra sugerir: não marca retrabalho sozinho.
  // antes, todo aparelho que já tinha vindo virava retrabalho automaticamente
  useEffect(() => {
    let ativo = true;
    setBuscando(true);

    buscarUltimaOsPorImei(imeiAparelho)
      .then((os) => {
        if (ativo) setUltimaOs(os);
      })
      .finally(() => {
        if (ativo) setBuscando(false);
      });

    return () => {
      ativo = false;
    };
  }, [imeiAparelho]);

  function atualizar(parcial: Partial<DadosChecklist>) {
    setDadosChecklist((atual) => ({ ...atual, ...parcial }));
  }

  function marcarRetrabalho(sim: boolean) {
    atualizar({ retrabalho: sim, osAnterior: sim && ultimaOs ? String(ultimaOs.numOs) : "" });
  }

  // copia a lista em vez de mexer na mesma: senão o React pode não redesenhar
  function atualizarItem(indice: number, mudanca: Partial<DadosChecklist["itens"][number]>) {
    setDadosChecklist((atual) => ({
      ...atual,
      itens: atual.itens.map((item, i) => (i === indice ? { ...item, ...mudanca } : item)),
    }));
  }

  const mostrarResumo = ultimaOs && dadosChecklist.osAnterior === String(ultimaOs.numOs);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2">
      <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <ClipboardList className="size-4 text-primary" /> Ordem de serviço
        </h2>

        {buscando ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Procurando consertos anteriores deste aparelho...
          </p>
        ) : ultimaOs ? (
          <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Esse aparelho voltou com o mesmo defeito?</p>
                <p className="text-xs text-muted-foreground">
                  Marque só se for o mesmo problema do último conserto. Outro defeito é O.S. normal.
                </p>
              </div>

              <div className="flex shrink-0 rounded-lg bg-muted p-0.5">
                {[
                  { valor: false, texto: "Não" },
                  { valor: true, texto: "Sim, é retrabalho" },
                ].map((opcao) => (
                  <button
                    key={opcao.texto}
                    type="button"
                    onClick={() => marcarRetrabalho(opcao.valor)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      dadosChecklist.retrabalho === opcao.valor
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {opcao.texto}
                  </button>
                ))}
              </div>
            </div>

            {dadosChecklist.retrabalho && (
              <div className="flex flex-col gap-3 border-t border-border pt-4 animate-in fade-in-0">
                {mostrarResumo && <ResumoOsAnterior os={ultimaOs} />}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="os-anterior" className="text-xs font-medium text-muted-foreground">
                    Número da O.S. anterior
                  </label>
                  <input
                    id="os-anterior"
                    inputMode="numeric"
                    value={dadosChecklist.osAnterior}
                    onChange={(e) => atualizar({ osAnterior: e.target.value.replace(/\D/g, "") })}
                    placeholder={String(ultimaOs.numOs)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary sm:w-40"
                  />
                  {!mostrarResumo && dadosChecklist.osAnterior && (
                    <p className="text-xs text-muted-foreground">
                      O sistema confere se essa O.S. é deste aparelho e se já foi entregue.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum conserto anterior finalizado deste aparelho na loja.</p>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="relato" className="text-xs font-bold text-foreground md:text-sm">
            Relato do problema *
          </label>
          <textarea
            id="relato"
            rows={4}
            placeholder="O que o cliente disse que está acontecendo com o aparelho"
            value={dadosChecklist.relato}
            onChange={(e) => atualizar({ relato: e.target.value })}
            className="w-full resize-none rounded-xl border border-border bg-background p-4 text-foreground outline-none focus:border-primary"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle2 className="size-4 text-primary" /> Checklist de entrada
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Marque o estado de cada item no momento em que o aparelho chegou.
        </p>

        <div className="flex flex-col gap-6">
          {dadosChecklist.itens.map((item, indice) => (
            <div key={item.nome} className="flex flex-col gap-3">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <span className="font-bold text-foreground">{item.nome}</span>
                <div className="flex items-center gap-2">
                  {BOTOES_STATUS.map(({ valor, texto, icone: Icone, ativo }) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => atualizarItem(indice, { status: valor })}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all",
                        item.status === valor
                          ? ativo
                          : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground",
                      )}
                    >
                      <Icone size={14} /> {texto}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Observação (opcional)"
                value={item.obs}
                onChange={(e) => atualizarItem(indice, { obs: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}