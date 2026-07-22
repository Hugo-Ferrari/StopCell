
import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <div>

            <div>
                <img src="" alt="" /> {/**faltando a imagem da stopcell */}
                <p>SISTEMA INTERNO</p>
            </div>
            <div>
                <form action="" className=''>

                    <label htmlFor="usuario">Usuario</label>
                    <input type="text" name='usuario' />
                </form>
                <form action="">
                    <label htmlFor="senha">Senha</label>
                    <input type="text" name='senha' />
                </form>
                <div>
                    <button>Entrar </button>

                </div>

                <Link to={"/recuperarSenha"}>
                <p>Esqueceu sua senha?</p>
                </Link>
            </div>

        </div>
    )
}

export default Login