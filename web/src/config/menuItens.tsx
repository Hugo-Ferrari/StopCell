import type { ReactNode } from "react";
import { ClipboardList, RotateCcw, Settings, Wallet } from "lucide-react";
import { PERMISSOES, type Permissao } from "@/utils/permissoes";

export interface MenuItem {
  icon: ReactNode;
  text: string;
  subtext: string;
  path: string;
  /** sem permissoes = qualquer usuário logado vê */
  permissoes?: Permissao[];
}

// usado pelo NavBar e pela proteção de rotas (pra saber pra onde mandar o funcionário)
export const MENU_ITENS: MenuItem[] = [
  {
    icon: <ClipboardList size={20} />,
    text: "Ordens de Serviço",
    subtext: "Cadastre e acompanhe serviços",
    path: "/ordemServico",
    permissoes: [PERMISSOES.ORDENS_VER],
  },
  {
    icon: <RotateCcw size={20} />,
    text: "Histórico",
    subtext: "Visualize serviços anteriores",
    path: "/historico",
    permissoes: [PERMISSOES.HISTORICO_VER],
  },
  {
    icon: <Wallet size={20} />,
    text: "Financeiro",
    subtext: "Receitas e despesas",
    path: "/financeiro",
    permissoes: [PERMISSOES.FINANCEIRO_VER],
  },
  {
    icon: <Settings size={20} />,
    text: "Configurações",
    subtext: "Personalize o sistema",
    path: "/configuracoes",
  },
];