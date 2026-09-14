interface DadosOrdemServicoProps {
  relato: string;
  setRelato: (texto: string) => void;
  onGerarOs: () => void;
}

function DadosOrdemServico({ relato, setRelato, onGerarOs }: DadosOrdemServicoProps) {
  return (
    <div className="space-y-5 bg-[#141414] border border-[#222222] p-5 md:p-8 rounded-3xl">
      
      <div>
        <label className="mb-2 block text-sm font-medium text-white">Técnico responsável</label>
        <input type="text" placeholder="Técnico Logado" readOnly className="w-full rounded-xl border border-[#222222] bg-[#0A0A0A] px-4 py-3 text-zinc-500 outline-none cursor-not-allowed"/>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">Relato do problema</label>
        <textarea
          rows={5}
          value={relato}
          onChange={(e) => setRelato(e.target.value)}
          placeholder="Descreva o problema relatado pelo cliente..."
          className="w-full resize-none rounded-xl border border-[#222222] bg-[#0A0A0A] px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#F25C38]"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row mt-6">
        <button type="button" onClick={onGerarOs} className="flex-1 rounded-xl bg-[#F25C38] py-4 font-bold text-white transition hover:opacity-90">
          Gerar OS Digital
        </button>

        <button type="button" className="flex-1 rounded-xl border border-[#222222] bg-[#0A0A0A] py-4 font-bold text-zinc-400 transition hover:bg-[#222222] hover:text-white">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default DadosOrdemServico;