import { useEffect, useState } from "react";
import { listarOpcoesAparelho, type OpcoesAparelho } from "@/services/deviceService";
import type { OpcaoSelect } from "@/components/common/CampoSelect";

interface OpcoesFormatadas {
  categorias: OpcaoSelect<number>[];
  marcas: OpcaoSelect<number>[];
}

function formatar(opcoes: OpcoesAparelho): OpcoesFormatadas {
  return {
    categorias: opcoes.categorias.map((c) => ({ value: c.idCategoria, label: c.nmCategoria ?? "Sem nome" })),
    marcas: opcoes.marcas.map((m) => ({ value: m.idMarca, label: m.nmMarca ?? "Sem nome" })),
  };
}

// categorias e marcas vêm do banco. antes eram listas fixas no front e o id era
// calculado pela posição na lista, o que quebrava se alguém cadastrasse outra marca
export function useOpcoesAparelho() {
  const [opcoes, setOpcoes] = useState<OpcoesFormatadas>({ categorias: [], marcas: [] });

  useEffect(() => {
    let ativo = true;

    listarOpcoesAparelho()
      .then((dados) => {
        if (ativo) setOpcoes(formatar(dados));
      })
      .catch(() => {
        // sem as opções o select fica vazio e o técnico percebe na hora; não precisa travar a tela
      });

    return () => {
      ativo = false;
    };
  }, []);

  return opcoes;
}