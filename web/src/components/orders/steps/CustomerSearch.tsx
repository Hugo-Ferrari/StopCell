import { buscarClientePorCpf, type criarClienteDto } from '@/services/customerService';
import { Search } from 'lucide-react'
import { useState } from 'react'

interface BuscarClienteProps{
    onBuscar:(cliente:criarClienteDto) => void
}
function BuscaCliente({onBuscar} : BuscarClienteProps) {
    const [cpfBusca, setCpfBusca] = useState("");

    async function buscarCliente() {
    try {
      const dados = await buscarClientePorCpf(cpfBusca)
      onBuscar(dados)
      
    }
    catch {
      alert(`cliente nao encontrado`)
    }

  }
  return (
    <div className="flex items-center rounded-lg border border-border bg-background  px-3 py-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary">
            <Search
              size={18}
              className="text-muted-foreground"
            />
            <input
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarCliente()
                }
              }}
              type="text"
              placeholder="CPF"
              className="ml-3 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
  </div>
  )
  
}

export default BuscaCliente