function DadosOrdemServico() {
  return (
    <div
      className="space-y-5">

     
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Técnico responsável
        </label>

        <input
          type="text"
          placeholder="Quem recebeu o aparelho"
          readOnly
          className="  w-full  rounded-lg  border  border-border  bg-background px-4  py-3 text-foreground placeholder:text-muted-foreground  outline-none  transition-colors  focus:border-primary focus:ring-2 focus:ring-primary/30"/>

        
      </div>


      
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Relato do problema
        </label>

        <textarea
          rows={5}
          placeholder="Descreva o problema..."
          className="
            w-full
            resize-none
            rounded-lg
            border
            border-border
            bg-background
            px-4
            py-3
            text-foreground
            placeholder:text-muted-foreground
            outline-none
            transition-colors
            focus:border-primary
            focus:ring-2
            focus:ring-primary/30
          "
        />
      </div>


      
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
        "
      >

        <button
          className="
            flex-1
            rounded-lg
            bg-primary
            py-3
            font-semibold
            text-primary-foreground
            transition
            hover:opacity-90
          "
        >
          Gerar OS Digital
        </button>


        <button
          className="
            flex-1
            rounded-lg
            border
            border-border
            bg-card
            py-3
            font-semibold
            text-muted-foreground
            transition
            hover:bg-accent
            hover:text-foreground
          "
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}

export default DadosOrdemServico;