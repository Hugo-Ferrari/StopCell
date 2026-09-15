import { type LucideIcon } from "lucide-react";
import React from "react";
type Props = {
  text:
    | "ITENS CADASTRADO"
    | "UNIDADE EM ESTOQUE"
    | "ESTOQUE BAIXO"
    | "VALOR INVESTIDO";
  icons: LucideIcon;
  valor: number;
};

function CardStock({ text, icons: Icon, valor }: Props) {
  return (
    <div className=" bg-card p-5 w-3xs rounded-xl">
      <div className="flex gap-2">
        <Icon size={20} className=""/>
        <p>{text}</p>
      </div>
      <div>
        <p className="">{valor}</p>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default CardStock;
