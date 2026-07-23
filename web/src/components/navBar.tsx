import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Menu, RotateCcw, Settings, TableOfContents, TextAlignJustifyIcon, Wallet, X } from "lucide-react"

function NavBar() {
    const [aberta, setAberta] = useState(false)

    const menuItens = [
        { icon: <ClipboardList size={20} />, text: "Ordem de Serviço", path: "/" },
        { icon: <RotateCcw size={20} />, text: "Histórico", path: "/historico" },
        { icon: <Wallet size={20} />, text: "Financeiro", path: "/financeiro" },
        { icon: <Settings size={20} />, text: "Configurações", path: "/configuracoes" }

    ]
    return (
        <aside className={` h-screen
      bg-zinc-900
      text-white
      transition-all
      duration-300
      ${aberta ? "w-60" : "w-15"}
    `}>
            <button onClick={() => setAberta(!aberta)}className={`p-4 ${aberta? "rotate-0" : "rotate-180"}`}>
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
                            <span>
                                {item.text}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
        </aside>

    )
}

export default NavBar