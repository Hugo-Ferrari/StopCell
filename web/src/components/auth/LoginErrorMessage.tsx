import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAvisos } from "@/hooks/useAvisos";

export type TipoErroLogin =
  | "emailNaoCadastrado"
  | "senhaIncorreta"
  | "senhaIncorretaRepetida"
  | "outro";

export interface ErroLogin {
  tipo: TipoErroLogin;
  /** usado só no tipo "outro" (ex: usuário desativado, servidor fora do ar) */
  mensagem?: string;
}

const linkClasse = "underline underline-offset-2 hover:text-foreground";

function textoDoErro(erro: ErroLogin): ReactNode {
  switch (erro.tipo) {
    case "emailNaoCadastrado":
      return (
        <>
          E-mail não cadastrado,{" "}
          <Link to="/cadastro" className={linkClasse}>
            crie uma conta
          </Link>
          .
        </>
      );
    case "senhaIncorreta":
      return "Senha incorreta.";
    case "senhaIncorretaRepetida":
      return (
        <>
          Senha incorreta. Clique em{" "}
          <Link to="/recuperarSenha" className={linkClasse}>
            Esqueceu a senha
          </Link>{" "}
          para mudar.
        </>
      );
    default:
      return erro.mensagem;
  }
}

function LoginErrorMessage({ erro }: { erro: ErroLogin | null }) {
  const { mostrar } = useAvisos();

  useEffect(() => {
    if (erro) mostrar(textoDoErro(erro), "erro");
  }, [erro, mostrar]);

  return null;
}

export default LoginErrorMessage;
