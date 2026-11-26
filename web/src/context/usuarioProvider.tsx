import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { RotateCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sairDoSistema } from "@/api/token";
import { buscarUsuarioLogado, type UsuarioLogado } from "@/services/userService";
import { naoEncontrado } from "@/utils/apiError";
import type { Permissao } from "@/utils/permissoes";
import { UsuarioContext } from "./usuarioContext";

// Busca o /usuario/me uma vez quando entra no sistema e deixa disponível
// pra qualquer tela (menu, rotas, botões) saber o que o usuário pode fazer.
export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [falhou, setFalhou] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      setUsuario(await buscarUsuarioLogado());
      setFalhou(false);
    } catch (error) {
      if (naoEncontrado(error)) sairDoSistema("expirada");
    }
  }, []);

  useEffect(() => {
    // evita atualizar o estado se o layout já tiver saído da tela (ex: logout)
    let montado = true;

    buscarUsuarioLogado()
      .then((dados) => montado && setUsuario(dados))
      // se for 401 o interceptor do axios já manda pro login
      .catch((error) => {
        if (naoEncontrado(error)) return sairDoSistema("expirada");
        if (montado) setFalhou(true);
      })
      .finally(() => montado && setCarregando(false));

    return () => {
      montado = false;
    };
  }, []);

  const value = useMemo(() => {
    const ehDono = usuario?.ehDono ?? false;
    const permissoes = usuario?.permissoes ?? [];

    return {
      usuario,
      carregando,
      ehDono,
      pode: (...lista: Permissao[]) => ehDono || lista.some((p) => permissoes.includes(p)),
      recarregar,
    };
  }, [usuario, carregando, recarregar]);

  if (falhou && !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div
          role="alert"
          className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center"
        >
          <WifiOff className="size-10 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Não foi possível carregar seus dados</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Confira sua conexão e tente de novo. Se continuar, avise o administrador da loja.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => window.location.reload()} className="h-10 rounded-xl px-5">
              <RotateCw /> Tentar de novo
            </Button>
            <Button variant="outline" onClick={() => sairDoSistema()} className="h-10 rounded-xl px-5">
              Sair
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>;
}
