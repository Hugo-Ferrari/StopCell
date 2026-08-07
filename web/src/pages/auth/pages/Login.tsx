import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Loader2, Sun, Moon } from "lucide-react";

import Marca from "@/components/common/Mark";
import { login, salvarToken } from "../authService";

function Login() {
  const navigate = useNavigate();

  const [emailUsuario, setEmailUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [tema, setTema] = useState<"claro" | "escuro">("escuro");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await login(emailUsuario, senha);

      salvarToken(data.token, lembrar);

      navigate("/ordemServico");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setErro("Usuário ou senha inválidos.");
      } else {
        setErro("Não foi possível logar. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background via-background to-card px-4">

      
      <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      
      <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-lg">

        <button
          type="button"
          onClick={() => setTema("claro")}
          aria-label="Tema claro"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            tema === "claro"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setTema("escuro")}
          aria-label="Tema escuro"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            tema === "escuro"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Moon className="h-4 w-4" />
        </button>
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
                onChange={(e) => setEmailUsuario(e.target.value)}
                required
                className=" w-full rounded-full border  border-border  bg-card  py-3  pl-11  pr-4  text-sm  text-foreground  placeholder:text-muted-foreground  outline-none  transition-all  focus:border-primary focus:ring-2 focus:ring-primary/30"/>
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
                type="password"
                name="senha"
                autoComplete="current-password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full rounded-full border border-border
                  bg-card py-3 pl-11 pr-4 text-sm text-foregro placeholder:text-muted-foregroun outline-none transition-all focus:border-primary  focus:ring-2 focus:ring-primary/30   "
              />
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

          {erro && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className=" mt-1 flex items-center justify-center gap-2 rounded-full border-2 border-primary py-3 text-sm font-bold text-primary transition-all hover:bg-primary  hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
            {carregando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          <Link
            to="/recuperarSenha"
            className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Esqueceu sua senha?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;