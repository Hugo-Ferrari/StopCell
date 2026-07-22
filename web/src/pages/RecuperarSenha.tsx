import React from 'react'
import { Link } from 'react-router-dom'

function RecuperarSenha() {
    return (
        <div>
            <div>
                {/**faltando um icone de seta.. */}
                <Link to={"/"}>
                <p>Voltar para o login</p>
                </Link>
            </div>
            <div>
                <h1>Recupere o acesso à sua conta</h1>
                <p>Digite o seu e-mail ou número cadastrado que enviaremos um link para redefinir sua senha</p>
            </div>
            <div>
                <form action="">
                    <label htmlFor="">E-mail ou telefone</label>
                    <input type="text" name='emial/telefone' placeholder='Digite seu email ou telefone'/>
                </form>
                <div>
                    {/**botão que irei fazer na aba de components */}
                </div>
            </div>
        </div>
    )
}

export default RecuperarSenha