import { useState } from "react";
import { esqueceuSenha, redefinirSenha } from "@/pages/auth/authService";
import { useCountdown } from "@/hooks/useCountdown";
import { mensagemDeErro } from "@/utils/apiError";
import { ESPERA_REENVIO_SEG } from "@/components/auth/recover/constants";
import type { ResetPasswordValues } from "@/components/auth/recover/ResetPasswordForm";

export type EtapaRecuperacao = "email" | "codigo" | "sucesso";

export function useRecoverPassword() {
  const [etapa, setEtapa] = useState<EtapaRecuperacao>("email");
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const reenvio = useCountdown();

  async function solicitarCodigo() {
    setErro(null);
    setCarregando(true);
    try {
      // o back responde igual mesmo se o e-mail não existir (anti-enumeração),
      // então sempre avança pra etapa do código
      await esqueceuSenha(email);
      setEtapa("codigo");
      reenvio.iniciar(ESPERA_REENVIO_SEG);
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível enviar o código. Tente novamente."));
    } finally {
      setCarregando(false);
    }
  }

  async function reenviarCodigo() {
    if (reenvio.ativo || carregando) return;

    setErro(null);
    setAviso(null);
    setCarregando(true);
    try {
      await esqueceuSenha(email);
      reenvio.iniciar(ESPERA_REENVIO_SEG);
      setAviso("Enviamos um novo código para o seu e-mail.");
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível reenviar o código. Tente novamente."));
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarNovaSenha({ codigo, novaSenha }: ResetPasswordValues) {
    setErro(null);
    setAviso(null);
    setCarregando(true);
    try {
      await redefinirSenha({ email, codigo, novaSenha });
      setEtapa("sucesso");
    } catch (error) {
      // depois de 5 erros o back invalida o código, aí precisa reenviar
      setErro(mensagemDeErro(error, "Código inválido ou expirado."));
    } finally {
      setCarregando(false);
    }
  }

  // caso a pessoa tenha digitado o e-mail errado
  function trocarEmail() {
    setErro(null);
    setAviso(null);
    setEtapa("email");
  }

  return {
    etapa,
    email,
    setEmail,
    carregando,
    erro,
    aviso,
    segundosParaReenvio: reenvio.restante,
    solicitarCodigo,
    reenviarCodigo,
    confirmarNovaSenha,
    trocarEmail,
  };
}