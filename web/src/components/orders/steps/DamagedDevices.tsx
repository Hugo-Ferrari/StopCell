import type { AparelhoDto } from "@/services/deviceService";

interface DadosAparelhosProps {
  aparelho: AparelhoDto | null;
}

function DadosAparelhos({ aparelho }: DadosAparelhosProps) {
  const exigeSenha =
    aparelho?.tipoSenha === "PADRAO" ||
    aparelho?.tipoSenha === "SENHA" ||
    aparelho?.tipoSenha === "PIN" ||
    aparelho?.tipoSenha === "Alfanumérica" ||
    aparelho?.tipoSenha === "Numérica (PIN)" ||
    aparelho?.tipoSenha === "Padrão (Desenho)";

  const cssInput = "w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-[#F25C38] focus:ring-2 focus:ring-[#F25C38]/30";

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Categoria</label>
        <input value={(aparelho as any)?.categoria?.nmCategoria ?? (aparelho as any)?.categoriaOs ?? ""} readOnly placeholder="Selecione" className={cssInput} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Marca</label>
        <input value={(aparelho as any)?.marca?.nmMarca ?? (aparelho as any)?.marcaOs ?? ""} readOnly placeholder="Selecione" className={cssInput} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Modelo do Aparelho</label>
        <input value={aparelho?.modelo ?? ""} readOnly placeholder="Ex.: iPhone 13" className={cssInput} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">IMEI / Nº de Série</label>
        <input value={aparelho?.imei ?? ""} readOnly placeholder="0000000000000" className={cssInput} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Cor</label>
        <input value={aparelho?.cor ?? ""} readOnly placeholder="Preto" className={cssInput} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Tipo de bloqueio</label>
        <input value={aparelho?.tipoSenha ?? ""} readOnly placeholder="Sem senha" className={cssInput} />
      </div>

      {exigeSenha && (
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-foreground">Senha do aparelho</label>
          <input value={aparelho?.senhaAparelho ?? ""} readOnly type="text" placeholder="Digite a senha" className={cssInput} />
        </div>
      )}
    </div>
  );
}

export default DadosAparelhos;