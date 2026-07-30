function NovoCliente() {
  return (
    <div className=" border border-border bg-card p-4 sm:p-6">
      <div className="space-y-4">

        <div>
          <label className="mb-2 block font-medium text-foreground">
            Cliente
          </label>

          <input
            type="text"
            placeholder="Digite o nome completo"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-foreground">
            CPF
          </label>

          <input
            type="text"
            placeholder="000.000.000-00"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-foreground">
            WhatsApp
          </label>

          <input
            type="text"
            placeholder="(00) 00000-0000"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <div>
            <label className="mb-2 block font-medium text-foreground">
              Modelo do Aparelho
            </label>

            <input
              type="text"
              placeholder="Ex: iPhone 13, Samsung A54..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>

          <label className="mt-4 mb-2 block font-medium text-foreground">
            Relato do Problema
          </label>

          <textarea
            rows={5}
            placeholder="Descreva o problema do aparelho relatado pelo cliente..."
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
  );
}

export default NovoCliente;