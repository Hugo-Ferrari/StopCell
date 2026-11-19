import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastItem, type TipoToast } from "@/components/common/Toast";
import { AvisosContext } from "./avisosContext";

const DURACAO: Record<TipoToast, number> = {
  sucesso: 4000,
  aviso: 6000,
  erro: 6000,
};

const MAXIMO_NA_TELA = 3;

interface Aviso {
  id: number;
  mensagem: ReactNode;
  tipo: TipoToast;
}

export function AvisosProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const proximoId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const fechar = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setAvisos((atuais) => atuais.filter((a) => a.id !== id));
  }, []);

  const mostrar = useCallback(
    (mensagem: ReactNode, tipo: TipoToast = "erro") => {
      const id = ++proximoId.current;
      setAvisos((atuais) => [...atuais, { id, mensagem, tipo }].slice(-MAXIMO_NA_TELA));
      timers.current.set(
        id,
        setTimeout(() => fechar(id), DURACAO[tipo]),
      );
    },
    [fechar],
  );

  useEffect(() => {
    const ativos = timers.current;
    return () => ativos.forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <AvisosContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 left-4 z-[100] flex flex-col items-end gap-2 sm:top-6 sm:right-6 sm:left-auto sm:w-96">
        {avisos.map((aviso) => (
          <ToastItem key={aviso.id} mensagem={aviso.mensagem} tipo={aviso.tipo} onFechar={() => fechar(aviso.id)} />
        ))}
      </div>
    </AvisosContext.Provider>
  );
}
