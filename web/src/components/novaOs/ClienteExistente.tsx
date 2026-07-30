import { Search } from "lucide-react";

function ClienteExistente() {
  return (
    <div className="bg-background p-4 sm:p-6">
      <div className="space-y-4">

        <div className="bg-card  border border-border p-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Cliente
          </h2>

          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Selecione um cliente para criar a Ordem de Serviço.
          </p>

          <div className="flex items-center rounded-lg border border-border bg-background px-3 py-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary">
            <Search
              size={18}
              className="text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Nome, CPF ou telefone"
              className="ml-3 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        <div className="bg-card  border border-border p-6">

          <h3 className="mb-5 text-lg font-semibold text-foreground">
            Dados da Ordem de Serviço
          </h3>

          <div className="space-y-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Nome do Cliente
              </label>

              <input
                type="text"
                placeholder="Selecione um cliente"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Modelo do Aparelho
              </label>

              <input
                type="text"
                placeholder="Ex.: iPhone 13"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Relato do Problema
              </label>

              <textarea
                rows={5}
                placeholder="Descreva o problema..."
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
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
        </div>

      </div>
    </div>
  );
}

export default ClienteExistente;