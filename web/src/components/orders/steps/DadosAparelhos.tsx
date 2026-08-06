import type { AparelhoDto } from '@/services/aparelho.service'

interface DadosAparelhosProps{
    aparelho: AparelhoDto | null
}
function DadosAparelhos({aparelho}: DadosAparelhosProps) {
  return (
    <div>
        <div>
              <label className="mb-2 block   text-foreground">
                Categoria
              </label>
              <input
                value={aparelho?.categoria?.nmCategoria?? ""}
                type="text"
                placeholder="Selecione"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Marca
              </label>
              <input
                value={aparelho?.marca?.nmMarca?? ""}
                type="text"
                placeholder="Selecione"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Modelo do Aparelho
              </label>

              <input
                value={aparelho?.modelo ?? ""}
                type="text"
                placeholder="Ex.: iPhone 13"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                IMEI / Nº de Série

              </label>

              <input
                value={aparelho?.imei ?? ""}
                type="text"
                placeholder="0000000000000"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Cor

              </label>

              <input
                value={aparelho?.cor ?? ""}
                type="text"
                placeholder="0000000000000"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Tipo de bloqueio

              </label>
              {/**se for "padrão", "senha" ou "pin" coloque o input para ter o campo para se digitar a senha, caso for " sem senha " ou ""biometria" não coloque nada*/}
              <input
                value={aparelho?.tipoSenha ??""}
                type="text"
                placeholder="Padrão "
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
    </div>
  )
}

export default DadosAparelhos