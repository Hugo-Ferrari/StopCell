import { useState } from "react";

export function useErrosFormulario<Campo extends string>(erros: Record<Campo, string | undefined>) {
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});

  function erro(campo: Campo) {
    return tentouEnviar || tocados[campo] ? erros[campo] : undefined;
  }

  const tocar = (campo: Campo) => () => setTocados((atual) => ({ ...atual, [campo]: true }));

  function podeEnviar() {
    setTentouEnviar(true);
    return !Object.values(erros).some(Boolean);
  }

  function reiniciar() {
    setTentouEnviar(false);
    setTocados({});
  }

  return { erro, tocar, podeEnviar, reiniciar };
}
