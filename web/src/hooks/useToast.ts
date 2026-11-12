import { useCallback, useEffect, useRef, useState } from "react";
import type { TipoToast } from "@/components/common/Toast";

const DURACAO = 4000;

export function useToast() {
  const [toast, setToast] = useState<{ mensagem: string; tipo: TipoToast } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrarToast = useCallback((mensagem: string, tipo: TipoToast) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ mensagem, tipo });
    timer.current = setTimeout(() => setToast(null), DURACAO);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { toast, mostrarToast };
}
