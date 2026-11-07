import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { isAxiosError } from "axios";

import Marca from "@/components/common/Mark";
import LoginErrorMessage, { type ErroLogin } from "@/components/auth/LoginErrorMessage";
import ThemeToggle from "@/components/common/ThemeToggle";
import { login, salvarToken } from "../authService";

// depois de quantas senhas erradas aparece o link de "Esqueceu a senha"
const TENTATIVAS_ATE_SUGERIR_RECUPERACAO = 3;

function Login() {
  const navigate = useNavigate();

  const [emailUsuario, setEmailUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<ErroLogin | null>(null);
  // conta as senhas erradas seguidas pro mesmo e-mail
  const [senhasErradas, setSenhasErradas] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!emailUsuario.trim() || !senha) {
      setErro({ tipo: "outro", mensagem: "Preencha o e-mail e a senha." });
      return;
    }

    setCarregando(true);

    try {
      const data = await login(emailUsuario.trim(), senha);

      salvarToken(data.token, lembrar);
      setSenhasErradas(0);

      navigate("/ordemServico");
    } catch (err: unknown) {
      // o back manda um "codigo" dizendo exatamente o que deu errado
      const codigo = isAxiosError(err) ? err.response?.data?.codigo : undefined;

      if (codigo === "EMAIL_NAO_CADASTRADO") {
        setSenhasErradas(0);
        setErro({ tipo: "emailNaoCadastrado" });
      } else if (codigo === "SENHA_INCORRETA") {
        const total = senhasErradas + 1;
        setSenhasErradas(total);
        setErro({
          tipo: total >= TENTATIVAS_ATE_SUGERIR_RECUPERACAO ? "senhaIncorretaRepetida" : "senhaIncorreta",
        });
      } else {
        // usuário desativado, api fora do ar, etc.
        const mensagemApi = isAxiosError(err) ? err.response?.data?.message : undefined;
        setErro({
          tipo: "outro",
          mensagem: typeof mensagemApi === "string" ? mensagemApi : "Não foi possível entrar. Tente novamente.",
        });
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background via-background to-card px-4">
      
      <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-sm">
        
        <div className="flex flex-col items-center text-center">
          <Marca size={176} />

          <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-foreground">
            Sistema Interno
          </p>
        </div>
       
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-5"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="emailUsuario"
              className="text-sm font-semibold text-foreground"
            >
              Usuário
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="emailUsuario"
                type="email"
                name="emailUsuario"
                autoComplete="username"
                placeholder="Digite seu e-mail"
                value={emailUsuario}
                onChange={(e) => {
                  setEmailUsuario(e.target.value);
                  // trocou de e-mail, começa a contar de novo
                  setSenhasErradas(0);
                }}
                required
                className=" w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="senha"
              className="text-sm font-semibold text-foreground"
            >
              Senha
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="senha"
                // alterna entre bolinhas e texto quando clica no olho
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                autoComplete="current-password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              />

              <button
                // type="button" pra não enviar o formulário quando clicar no olho
                type="button"
                onClick={() => setMostrarSenha((m) => !m)}
                aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                title={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              >
                {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <label
            htmlFor="lembrar"
            className="flex cursor-pointer items-center gap-2.5 select-none"
          >
            <input
              id="lembrar"
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-card accent-primary"
            />

            <span className="text-sm text-secondary-foreground">
              Lembrar-me
            </span>
          </label>

          <LoginErrorMessage erro={erro} />

          <button
            type="submit"
            disabled={carregando}
            className=" mt-1 flex items-center justify-center gap-2 rounded-full border-2 border-primary py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
            {carregando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          {/* Área de links agrupados e padronizados */}
          <div className="flex flex-col items-center gap-3 pt-1">
            <Link
              to="/recuperarSenha"
              className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>
            
            <Link
              to="/cadastro"
              className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Ainda não tem conta? Cadastre-se
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;