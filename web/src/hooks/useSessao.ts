import { useEffect } from "react";
import { expiracaoDoToken, lembrouDoLogin, obterToken, sairDoSistema } from "@/api/token";

const TEMPO_INATIVIDADE = 2 * 60 * 60 * 1000;
const INTERVALO_CONFERENCIA = 30 * 1000;
const EVENTOS_DE_USO = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"] as const;

export function useSessao() {
  useEffect(() => {
    let ultimoUso = Date.now();
    const registrarUso = () => {
      ultimoUso = Date.now();
    };

    function conferir() {
      const token = obterToken();
      if (!token) return sairDoSistema();

      const expiracao = expiracaoDoToken(token);
      if (expiracao !== null && Date.now() >= expiracao) return sairDoSistema("expirada");

      if (!lembrouDoLogin() && Date.now() - ultimoUso >= TEMPO_INATIVIDADE) {
        return sairDoSistema("inatividade");
      }
    }

    function aoVoltarPraAba() {
      if (document.visibilityState === "visible") conferir();
    }

    EVENTOS_DE_USO.forEach((evento) => window.addEventListener(evento, registrarUso, { passive: true }));
    document.addEventListener("visibilitychange", aoVoltarPraAba);
    const intervalo = window.setInterval(conferir, INTERVALO_CONFERENCIA);

    return () => {
      EVENTOS_DE_USO.forEach((evento) => window.removeEventListener(evento, registrarUso));
      document.removeEventListener("visibilitychange", aoVoltarPraAba);
      window.clearInterval(intervalo);
    };
  }, []);
}
