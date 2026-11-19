import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { isAxiosError } from "axios";

import Marca from "@/components/common/Mark";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import LoginErrorMessage, { type ErroLogin } from "@/components/auth/LoginErrorMessage";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import type { TipoToast } from "@/components/common/Toast";
import { useAvisos } from "@/hooks/useAvisos";
import ThemeToggle from "@/components/common/ThemeToggle";
import { login, salvarToken } from "../authService";
import { obterToken, tokenVencido } from "@/api/token";

// depois de quantas senhas erradas aparece o link de "Esqueceu a senha"
const TENTATIVAS_ATE_SUGERIR_RECUPERACAO = 3;

const AVISOS_SESSAO: Record<string, { mensagem: string; tipo: TipoToast }> = {
  expirada: { mensagem: "Sua sessão terminou. Entre de novo para continuar.", tipo: "aviso" },
  inatividade: {
    mensagem: "Você ficou um tempo sem usar o sistema e saiu por segurança. Entre de novo para continuar.",
    tipo: "aviso",
  },
  saiu: { mensagem: "Você saiu do sistema.", tipo: "sucesso" },
};

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cadastro = useLocation().state as { email?: string; mensagem?: string } | null;
  const { mostrar } = useAvisos();

  const [avisoInicial] = useState(() => {
    const sessao = AVISOS_SESSAO[searchParams.get("sessao") ?? ""];
    if (sessao) return sessao;
    if (cadastro?.mensagem) return { mensagem: cadastro.mensagem, tipo: "sucesso" as const };
    return null;
  });

  useEffect(() => {
    if (!avisoInicial) return;
    mostrar(avisoInicial.mensagem, avisoInicial.tipo);
    navigate("/", { replace: true });
  }, [avisoInicial, mostrar, navigate]);

  const [emailUsuario, setEmailUsuario] = useState(cadastro?.email ?? "");
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
      const data = await login(emailUsuario.trim(), senha, lembrar);

      salvarToken(data.token, lembrar);
      setSenhasErradas(0);

      mostrar("Login feito com sucesso!", "sucesso");
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

  const token = obterToken();
  if (token && !tokenVencido(token)) {
    return <Navigate to="/ordemServico" replace />;
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
          <FormInput
            label="E-mail"
            id="emailUsuario"
            type="email"
            name="emailUsuario"
            icon={<Mail size={18} />}
            autoComplete="username"
            placeholder="Digite seu e-mail"
            value={emailUsuario}
            onChange={(e) => {
              setEmailUsuario(e.target.value);
              // trocou de e-mail, começa a contar de novo
              setSenhasErradas(0);
            }}
          />

          <FormInput
            label="Senha"
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            name="senha"
            icon={<Lock size={18} />}
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            trailing={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMostrarSenha((m) => !m)}
                aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                title={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                className="size-8 rounded-lg text-muted-foreground"
              >
                {mostrarSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            }
          />

          <label htmlFor="lembrar" className="flex cursor-pointer items-center gap-2.5 select-none">
            <input
              id="lembrar"
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="size-4 rounded border-border bg-card accent-primary"
            />
            <span className="text-sm text-muted-foreground">Lembrar-me</span>
          </label>

          <LoginErrorMessage erro={erro} />

          <AuthSubmitButton carregando={carregando} textoCarregando="Entrando...">
            Entrar
          </AuthSubmitButton>

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