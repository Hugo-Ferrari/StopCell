import type { criarClienteDto } from "@/services/customerService";

interface DadosClienteProps {
  cliente: criarClienteDto | null;
}

function DadosCliente({ cliente }: DadosClienteProps) {
  return (
    <div
      className="  grid grid-cols-1 gap-5md:grid-cols-2 ">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Nome do Cliente
        </label>

        <input
          value={cliente?.nmCompleto ?? ""}
          readOnly
          type="text"
          placeholder="Selecione um cliente"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2focus:ring-primary"/>
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          CPF
        </label>

        <input
          value={cliente?.cpf ?? ""}
          readOnly
          type="text"
          placeholder="000.000.000-00"
          className=" w-full rounded-lg border border-border  bg-card px-4  py-3  text-foreground  placeholder:text-muted-foreground outline-none  transition-colors focus:border-primary  focus:ring-2  focus:ring-primary"/>
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          WhatsApp
        </label>

        <input
          value={cliente?.telefone ?? ""}
          readOnly
          type="text"
          placeholder="(00)00000-0000"
          className="   w-full  rounded-lg border border-border  bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"/>
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Email
        </label>

        <input
          value={cliente?.email ?? ""}
          readOnly
          type="text"
          placeholder="cliente@email.com"
          className=" w-full  rounded-lg  border  border-border  bg-card  px-4  py-3  text-foreground  placeholder:text-muted-foreground  outline-none  transition-colors focus:border-primaryfocus:ring-2 focus:ring-primary "/>
      </div>


      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Endereço
        </label>

        <input
          value={cliente?.endereco ?? ""}
          readOnly
          type="text"
          placeholder="rua, numero, bairro, cidade"
          className=" w-full rounded-lg borderborder-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground  outline-none   transition-colors  focus:border-primary focus:ring-2 focus:ring-primary"/>
      </div>
    </div>
  );
}

export default DadosCliente;