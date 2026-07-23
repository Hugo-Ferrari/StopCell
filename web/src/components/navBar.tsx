import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
    const [opem, setOpem] = useState(false)

    const toggleMenu = () =>{
        setOpem(!opem)
    }
  return (
    <nav>
        <div>
            {/** logo */}
        </div>
        <Link to={"/ordemServico"}>
        Ordem de Servico
        </Link>
        <Link to={"/financeiro"}>
        Financeiro
        </Link>
    </nav>
  )
}

export default NavBar