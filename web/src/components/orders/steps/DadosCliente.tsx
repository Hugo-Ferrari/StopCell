import type { criarClienteDto } from '@/services/cliente.service'

interface DadosClienteProps {
    cliente :  criarClienteDto | null 
}
function DadosCliente({cliente} : DadosClienteProps) {
    return (
        <div className=''>
            <div>
                <label className="mb-2 block   text-foreground">
                    Nome do Cliente
                </label>

                <input
                    value={cliente?.nmCompleto ?? ""}
                    type="text"
                    placeholder="Selecione um cliente"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="mb-2 block   text-foreground">
                    CPF
                </label>

                <input
                    value={cliente?.cpf ?? ""}
                    type="text"
                    placeholder="000.000.000-00"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="mb-2 block   text-foreground">
                    WhatsApp
                </label>

                <input
                    value={cliente?.telefone ?? ""}
                    type="text"
                    placeholder="(00)00000-0000"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="mb-2 block   text-foreground">
                    Email
                </label>

                <input
                    value={cliente?.email ?? ""}
                    type="text"
                    placeholder="cliente@email.com"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="mb-2 block   text-foreground">
                    Endereço
                </label>

                <input
                    value={cliente?.endereco ?? ""}
                    type="text"
                    placeholder="rua, numero, bairro, cidade"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    )
}

export default DadosCliente