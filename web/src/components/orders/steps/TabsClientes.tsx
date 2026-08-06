import { useState } from "react";
import ClienteExistente from "./ClienteExistente";
import NovoCliente from "./NovoCliente";
import { User, UserRoundPlus } from "lucide-react";

function TabsClientes() {
    const [abaAtiva, setAbaAtiva] = useState("existente");

    return (
        <div className="w-full">

            <div className="flex gap-2border-border gap-2">
                <button
                    onClick={() => setAbaAtiva("existente")}
                    className={` flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg transition-all duration-200 border
                        ${
                            abaAtiva === "existente"
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                        }
                    `}
                >
                    <User size={22} />
                    <span className="font-medium">
                        Cliente Existente
                    </span>
                </button>

                <button
                    onClick={() => setAbaAtiva("novo")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg transition-all duration-200 border
                        ${
                            abaAtiva === "novo"
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                        }
                    `}
                >
                    <UserRoundPlus size={22} />
                    <span className="font-medium">
                        Cadastrar novo cliente
                    </span>
                </button>
            </div>

            <div className="mt-4">
                {abaAtiva === "existente" && <ClienteExistente />}
                {abaAtiva === "novo" && <NovoCliente />}
            </div>

        </div>
    );
}

export default TabsClientes;