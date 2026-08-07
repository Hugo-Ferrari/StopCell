import type { AparelhoDto } from "@/services/deviceService";

interface DadosAparelhosProps {
  aparelho: AparelhoDto | null;
}

function DadosAparelhos({ aparelho }: DadosAparelhosProps) {

  const exigeSenha =
    aparelho?.tipoSenha === "PADRAO" ||
    aparelho?.tipoSenha === "SENHA" ||
    aparelho?.tipoSenha === "PIN";


  return (
    <div
      className="  grid grid-cols-1 gap-5 md:grid-cols-2">

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Categoria
        </label>

        <input
          value={aparelho?.categoria?.nmCategoria ?? ""}
          readOnly
          placeholder="Selecione"
          className="input-style"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Marca
        </label>

        <input
          value={aparelho?.marca?.nmMarca ?? ""}
          readOnly
          placeholder="Selecione"
          className="input-style"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Modelo do Aparelho
        </label>

        <input
          value={aparelho?.modelo ?? ""}
          readOnly
          placeholder="Ex.: iPhone 13"
          className="input-style"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          IMEI / Nº de Série
        </label>

        <input
          value={aparelho?.imei ?? ""}
          readOnly
          placeholder="0000000000000"
          className="input-style"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Cor
        </label>

        <input
          value={aparelho?.cor ?? ""}
          readOnly
          placeholder="Preto"
          className="input-style"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Tipo de bloqueio
        </label>

        <input
          value={aparelho?.tipoSenha ?? ""}
          readOnly
          placeholder="Sem senha"
          className="input-style"
        />
      </div>


      {exigeSenha && (
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Senha do aparelho
          </label>

          <input
            value={aparelho?.senhaAparelho ?? ""}
            readOnly
            type="text"
            placeholder="Digite a senha"
            className="input-style"
          />
        </div>
      )}

    </div>
  );
}

export default DadosAparelhos;