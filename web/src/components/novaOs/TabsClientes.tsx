import { useState } from "react";
import ClienteExistente from "./ClienteExistente";
import NovoCliente from "./NovoCliente";
import { User, UserRoundPlus } from "lucide-react";

function TabsClientes() {
    const [abaAtiva, setAbaAtiva] = useState("existente");

    return (
        <div className="w-full">
            <div className="flex gap-2 border-b p-3">
                <button
                    onClick={() => setAbaAtiva("existente")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg transition-colors ${abaAtiva === "existente"? "bg-orange-500 text-white": "bg-zinc-200 hover:bg-zinc-300"}`}>
                    <User size={25} />
                    <span>Cliente Existente</span>
                </button>

                <button
                    onClick={() => setAbaAtiva("novo")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg transition-colors ${abaAtiva === "novo"? "bg-orange-500 text-white": "bg-zinc-200 hover:bg-zinc-300"}`}>
                    <UserRoundPlus size={25} />
                    <span>Cadastrar novo cliente</span>
                </button>
            </div>

            <div>
                {abaAtiva === "existente" && <ClienteExistente />}
                {abaAtiva === "novo" && <NovoCliente />}
            </div>

        </div>
    );
}

export default TabsClientes;