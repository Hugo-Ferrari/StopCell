import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Menu, RotateCcw, Settings, Wallet, X } from "lucide-react"

function NavBar() {
    const [aberta, setAberta] = useState(false)

    const menuItens = [
        { icon: <ClipboardList size={20} />, text: "Ordem de Serviço", subtext: "Cadastre e acompanhe serviços", path: "/" },
        { icon: <RotateCcw size={20} />, text: "Histórico", subtext: "Visualize serviços anteriores", path: "/historico" },
        { icon: <Wallet size={20} />, text: "Fornecedores", subtext: "Cadastre e gerencie fornecedores", path: "/fornecedores"},
        { icon: <Wallet size={20} />, text: "Financeiro", subtext: "Controle receitas e despesas", path: "/financeiro" },
        { icon: <Settings size={20} />, text: "Configurações", subtext: "Personalize o sistema", path: "/configuracoes" }
    ]

    return (
        <aside className={` h-screen
      bg-zinc-900
      text-white
      transition-all
      duration-300
      ${aberta ? "w-60" : "w-15"}
    `}>
            <button onClick={() => setAberta(!aberta)}className={`p-4 ${aberta? "rotate-0 w-full flex justify-end" : "rotate-180 justify-center"}`}>
                {aberta? <X/> : <Menu />}
            </button>
            <nav>
                {menuItens.map((item) => (
                    <Link
                        key={item.text}
                        to={item.path}
                        className="flex items-center gap-4 p-4"
                    >
                        {item.icon}
                        {aberta && (
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">
                                    Ordem de Serviço
                                </span>
                                <span className="text-xs text-zinc-400">
                                    Cadastre e acompanhe serviços
                                </span>
                            </div>
                            
                        )}
                    </Link>
                ))}
            </nav>
        </aside>

    )
}

export default NavBar