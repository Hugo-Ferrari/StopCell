import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { buscarUsuarioLogado, type UsuarioLogado } from "@/services/userService";
import type { Permissao } from "@/utils/permissoes";
import { UsuarioContext } from "./usuarioContext";

// Busca o /usuario/me uma vez quando entra no sistema e deixa disponível
// pra qualquer tela (menu, rotas, botões) saber o que o usuário pode fazer.
export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      setUsuario(await buscarUsuarioLogado());
    } catch (error) {
      console.error("Erro ao carregar usuário logado:", error);
    }
  }, []);

  useEffect(() => {
    // evita atualizar o estado se o layout já tiver saído da tela (ex: logout)
    let montado = true;

    buscarUsuarioLogado()
      .then((dados) => montado && setUsuario(dados))
      // se for 401 o interceptor do axios já manda pro login
      .catch((error) => console.error("Erro ao carregar usuário logado:", error))
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

  return <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>;
}