import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, KeyRound, Lock, Loader2 } from 'lucide-react'
import Marca from '@/components/common/Mark'
import FormInput from '@/components/common/FormInput'
import { esqueceuSenha, redefinirSenha } from '../authService'

type Etapa = 'email' | 'codigo'

function RecuperarSenha() {
    const navigate = useNavigate()
    const [etapa, setEtapa] = useState<Etapa>('email')
    const [carregando, setCarregando] = useState(false)

    const [email, setEmail] = useState('')
    const [codigo, setCodigo] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
    const [confirmarTocado, setConfirmarTocado] = useState(false)

    const erroConfirmar = confirmarTocado && confirmarNovaSenha.length > 0 && novaSenha !== confirmarNovaSenha
        ? 'As senhas não coincidem'
        : undefined

    async function handleEnviarEmail(e: FormEvent) {
        e.preventDefault()
        setCarregando(true)
        try {
            await esqueceuSenha(email)
            setEtapa('codigo')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erro ao enviar o código. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    async function handleRedefinirSenha(e: FormEvent) {
        e.preventDefault()

        if (novaSenha !== confirmarNovaSenha) {
            alert('As senhas não coincidem!')
            return
        }

        setCarregando(true)
        try {
            await redefinirSenha({ email, codigo, novaSenha })
            alert('Senha redefinida com sucesso! Faça login com a nova senha.')
            navigate('/')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Código inválido ou expirado.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 flex flex-col items-center relative overflow-x-hidden">

            <div className="w-full max-w-md flex justify-start mb-6 md:mb-8">
                <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span>Voltar para o login</span>
                </Link>
            </div>

            <div className="w-full max-w-md flex flex-col items-center text-center mb-8">
                <Marca size={120} />
                <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-2">
                    {etapa === 'email' ? 'Recupere o acesso à sua conta' : 'Digite o código'}
                </h1>
                <p className="text-zinc-400 text-sm md:text-base max-w-sm">
                    {etapa === 'email'
                        ? 'Digite o seu e-mail cadastrado que enviaremos um código para redefinir sua senha'
                        : `Enviamos um código para ${email}. Digite-o abaixo e escolha sua nova senha`}
                </p>
            </div>

            {etapa === 'email' ? (
                <form
                    onSubmit={handleEnviarEmail}
                    className="w-full max-w-md bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-10 flex flex-col gap-6"
                >
                    <FormInput
                        label="E-mail"
                        icon={<Mail size={18} />}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu email"
                    />
                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full bg-[#F25C38] hover:bg-[#e04f2d] text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {carregando ? <Loader2 className="animate-spin" size={20} /> : 'Enviar código'}
                    </button>
                </form>
            ) : (
                <form
                    onSubmit={handleRedefinirSenha}
                    className="w-full max-w-md bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-10 flex flex-col gap-6"
                >
                    <FormInput
                        label="Código recebido"
                        icon={<KeyRound size={18} />}
                        type="text"
                        required
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                    />
                    <FormInput
                        label="Nova senha"
                        icon={<Lock size={18} />}
                        type="password"
                        required
                        minLength={6}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                    />
                    <FormInput
                        label="Confirmar nova senha"
                        icon={<Lock size={18} />}
                        type="password"
                        required
                        minLength={6}
                        value={confirmarNovaSenha}
                        onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                        onBlur={() => setConfirmarTocado(true)}
                        placeholder="Repita a nova senha"
                        error={erroConfirmar}
                    />
                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full bg-[#F25C38] hover:bg-[#e04f2d] text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {carregando ? <Loader2 className="animate-spin" size={20} /> : 'Redefinir senha'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setEtapa('email')}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        Não recebeu o código? Reenviar
                    </button>
                </form>
            )}
        </div>
    )
}

export default RecuperarSenha