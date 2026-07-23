import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Loader2, Sun, Moon } from 'lucide-react'
import { login, salvarToken } from '@/services/auth.service'

function Login() {
    const navigate = useNavigate()

    const [emailUsuario, setEmailUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [lembrar, setLembrar] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState('')
    const [tema, setTema] = useState<'claro' | 'escuro'>('escuro')

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setErro('')
        setCarregando(true)

        try {
            const { data } = await login(emailUsuario, senha);
            salvarToken(data.token);
            navigate('/ordemServico')
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setErro('Usuário ou senha inválidos.')
            } else {
                setErro('Não foi possível logar. Tente novamente.')
            }
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-black px-4">

            {/* toggle de tema */}
            <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 p-1">
                <button
                    type="button"
                    onClick={() => setTema('claro')}
                    aria-label="Tema claro"
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${tema === 'claro' ? 'bg-orange-500 text-black' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                >
                    <Sun className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setTema('escuro')}
                    aria-label="Tema escuro"
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${tema === 'escuro' ? 'bg-orange-500 text-black' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                >
                    <Moon className="h-4 w-4" />
                </button>
            </div>

            <div className="w-full max-w-sm">

                {/* marca */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative flex h-44 w-44 items-center justify-center">
                        <svg
                            viewBox="0 0 100 115"
                            className="absolute inset-0 h-full w-full text-orange-500"
                            fill="none"
                        >
                            <path
                                d="M50 2 L96 28.5 L96 81.5 L50 108 L4 81.5 L4 28.5 Z"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            />
                        </svg>
                        <span className="relative text-2xl font-extrabold uppercase leading-tight tracking-wide">
                            <span className="block text-white">
                                ST<span className="text-orange-500">O</span>P
                            </span>
                            <span className="block text-orange-500">CELL</span>
                        </span>
                    </div>
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-white">
                        Sistema interno
                    </p>
                </div>

                {/* formulário */}
                <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5" noValidate>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="emailUsuario" className="text-sm font-semibold text-white">
                            Usuário
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                            <input
                                id="emailUsuario"
                                type="email"
                                name="emailUsuario"
                                autoComplete="username"
                                placeholder="admin"
                                value={emailUsuario}
                                onChange={(e) => setEmailUsuario(e.target.value)}
                                required
                                className="w-full rounded-full bg-neutral-900 py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:ring-2 focus:ring-orange-500/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="senha" className="text-sm font-semibold text-white">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                            <input
                                id="senha"
                                type="password"
                                name="senha"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                className="w-full rounded-full bg-neutral-900 py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:ring-2 focus:ring-orange-500/50"
                            />
                        </div>
                    </div>

                    <label htmlFor="lembrar" className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                            id="lembrar"
                            type="checkbox"
                            checked={lembrar}
                            onChange={(e) => setLembrar(e.target.checked)}
                            className="h-4 w-4 rounded-sm border-neutral-700 bg-neutral-900 accent-orange-500"
                        />
                        <span className="text-sm text-neutral-300">Lembrar-me</span>
                    </label>

                    {erro && (
                        <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                            {erro}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                        className="mt-1 flex items-center justify-center gap-2 rounded-full border-2 border-orange-500 py-3 text-sm font-bold text-orange-500 transition-colors hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {carregando ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>

                    <Link
                        to="/recuperarSenha"
                        className="text-center text-sm text-neutral-400 transition-colors hover:text-orange-500"
                    >
                        Esqueceu sua senha?
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default Login