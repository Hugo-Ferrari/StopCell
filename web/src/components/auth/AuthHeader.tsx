import { type ReactNode } from "react";
import Marca from "@/components/common/Mark";

interface AuthHeaderProps {
  titulo: string;
  descricao?: ReactNode;
}

function AuthHeader({ titulo, descricao }: AuthHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <Marca size={140} />

      <h1 className="mt-8 text-2xl font-bold text-foreground md:text-[1.75rem]">
        {titulo}
      </h1>

      {descricao && (
        <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
          {descricao}
        </p>
      )}
    </header>
  );
}

export default AuthHeader;