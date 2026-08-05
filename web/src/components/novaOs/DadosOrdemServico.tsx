import React from 'react'

function DadosOrdemServico() {
  return (
    <div>
        <div>
              <label className="">
                Técnico responsavel
              </label>
              <input placeholder="Quem Recebeu o aparelho" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary">{/**Usuario dono da empresa */}</input>
            </div>
            <div>
              <label className="mb-2 block text-foreground ">
                Relato do Problema
              </label>

              <textarea
                rows={5}
                placeholder="Descreva o problema..."
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Gerar OS Digital
            </button>

            <button
              className="w-full rounded-lg border border-border bg-card py-3 font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Cancelar
            </button>

          </div>
    
  )
}

export default DadosOrdemServico