import { Link } from "react-router-dom";

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

const linkClasse = "font-semibold underline underline-offset-2 hover:text-foreground";

function LoginErrorMessage({ erro }: { erro: ErroLogin | null }) {
  if (!erro) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {erro.tipo === "emailNaoCadastrado" && (
        <>
          E-mail não cadastrado,{" "}
          <Link to="/cadastro" className={linkClasse}>
            crie uma conta
          </Link>
          .
        </>
      )}

      {erro.tipo === "senhaIncorreta" && "Senha incorreta."}

      {erro.tipo === "senhaIncorretaRepetida" && (
        <>
          Senha incorreta. Clique em{" "}
          <Link to="/recuperarSenha" className={linkClasse}>
            Esqueceu a senha
          </Link>{" "}
          para mudar.
        </>
      )}

      {erro.tipo === "outro" && erro.mensagem}
    </div>
  );
}

export default LoginErrorMessage;