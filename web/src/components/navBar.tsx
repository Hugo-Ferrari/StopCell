import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Menu, RotateCcw, Settings, Van, Wallet, X } from "lucide-react"

function NavBar() {
    const [aberta, setAberta] = useState(false)

    const menuItens = [
        { icon: <ClipboardList size={20}  />, text: "Ordem de Serviço", subtext: "Cadastre e acompanhe serviços", path: "/ordemServico", },
        { icon: <RotateCcw size={20}  />, text: "Histórico", subtext: "Visualize serviços anteriores", path: "/historico" },
        { icon: <Van size={20}  />, text: "Fornecedores", subtext: "Cadastre e gerencie fornecedores", path: "/fornecedores" },
        { icon: <Wallet size={20}  />, text: "Financeiro", subtext: "Controle receitas e despesas", path: "/financeiro" },
        { icon: <Settings size={20}  />, text: "Configurações", subtext: "Personalize o sistema", path: "/configuracoes" }
    ]

    return (
        <aside className={` overflow-hidden fixed top-0 left-0 h-15  text-white transition-all duration-300 z-50 mt-3 ${aberta ? "w-60 h-screen bg-black" : "w-15"}`}>
            
                <button onClick={() => setAberta(!aberta)} className={`p-4 ${aberta ? "rotate-0 w-full flex justify-end " : "rotate-180 justify-center"}`}>
                    {aberta ? <X /> : <Menu />}
                </button>
            
            <nav className=''>
                {menuItens.map((item) => (
                    <Link
                        key={item.text}
                        to={item.path}
                        className=" group flex items-center gap-4 p-4 "
                    >
                        
                        {aberta && (
                            
                            <div className="flex flex-col">
                                {item.icon}
                                <span className="text-sm font-semibold text-white group-hover:text-orange-500">
                                    {item.text}
                                </span>
                                <span className="text-xs text-zinc-400 ">
                                    {item.subtext}
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