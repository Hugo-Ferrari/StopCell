// É o contador de “reenviar em 60s”

import { useCallback, useEffect, useState } from "react";

export function useCountdown() {
  const [restante, setRestante] = useState(0);

  useEffect(() => {
    if (restante <= 0) return;

    const timer = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [restante]);

  const iniciar = useCallback((segundos: number) => setRestante(segundos), []);

  return { restante, ativo: restante > 0, iniciar };
}