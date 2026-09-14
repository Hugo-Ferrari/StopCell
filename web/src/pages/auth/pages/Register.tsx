import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, User, Phone, Mail, Lock, Loader2 } from "lucide-react";
import Marca from "@/components/common/Mark";
import FormInput from "@/components/common/FormInput";
import { cadastrarUsuario } from "../authService";
import { formatarCnpj, formatarTelefone } from "@/utils/masks";
import { emailValido } from "@/utils/validartors";

function Register() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);

  // Estados - EMPRESA
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");

  // Estados - DONO DA EMPRESA
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [emailTocado, setEmailTocado] = useState(false);

  // Estados - ACESSO AO SISTEMA
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [confirmarSenhaTocado, setConfirmarSenhaTocado] = useState(false);

  const erroEmail = emailTocado && email.length > 0 && !emailValido(email)
    ? "Digite um e-mail válido (ex: nome@dominio.com)"
    : undefined;

  const erroConfirmarSenha = confirmarSenhaTocado && confirmarSenha.length > 0 && senha !== confirmarSenha
    ? "As senhas não coincidem"
    : undefined;

  const formularioValido = emailValido(email) && senha === confirmarSenha && senha.length >= 6;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!emailValido(email)) {
      alert("Digite um e-mail válido!");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    setCarregando(true);
    try {
      const payload = {
        empresa: {
          nomeFantasia: nomeEmpresa,
          razaoSocial: nomeEmpresa,
          cnpj: cnpj.replace(/\D/g, "") || "00000000000000",
          telefone: whatsapp.replace(/\D/g, ""),
          endereco: cidade,
        },
        usuario: {
          nome: nomeCompleto,
          login: usuario,
          emailUsuario: email,
          senha: senha,
        }
      };

      await cadastrarUsuario(payload);

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const msgErro = error.response?.data?.message || "Erro ao criar conta. Verifique os dados.";
      alert(Array.isArray(msgErro) ? msgErro.join(", ") : msgErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 flex flex-col items-center relative overflow-x-hidden">

      <div className="w-full max-w-2xl flex justify-start mb-6 md:mb-8">
        <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Voltar para o login</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center text-center mb-8">
        <Marca size={120} />
        <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-2">Criar conta do dono</h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-md">
          Cadastre a sua assistência técnica. O acesso ao sistema é exclusivo do dono da empresa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-10 flex flex-col gap-10">

        
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Empresa</h2>

          <FormInput
            label="Nome da empresa"
            icon={<Building2 size={18} />}
            type="text" required
            value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)}
            placeholder="Ex: Stop Cell Assistência Técnica"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="CNPJ"
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            <FormInput
              label="Cidade"
              icon={<MapPin size={18} />}
              type="text" required
              value={cidade} onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Franca"
            />
          </div>
        </section>

        
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Dono da Empresa</h2>

          <FormInput
            label="Nome completo"
            icon={<User size={18} />}
            type="text" required
            value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)}
            placeholder="Digite o nome completo"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="WhatsApp"
              icon={<Phone size={18} />}
              type="text" required
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatarTelefone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
            <FormInput
              label="E-mail"
              icon={<Mail size={18} />}
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTocado(true)}
              placeholder="contato@stopcell.com.br"
              error={erroEmail}
            />
          </div>
        </section>

        
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Acesso ao Sistema</h2>

          <FormInput
            label="Usuário"
            icon={<User size={18} />}
            type="text" required
            value={usuario} onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ex: diogo"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Senha"
              icon={<Lock size={18} />}
              type="password" required minLength={6}
              value={senha} onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
            <FormInput
              label="Confirmar senha"
              icon={<Lock size={18} />}
              type="password" required minLength={6}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              onBlur={() => setConfirmarSenhaTocado(true)}
              placeholder="Repita a senha"
              error={erroConfirmarSenha}
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={carregando || !formularioValido}
          className="w-full bg-[#F25C38] hover:bg-[#e04f2d] text-white font-bold py-4 rounded-xl mt-2 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {carregando ? <Loader2 className="animate-spin" size={20} /> : "Criar conta e entrar"}
        </button>

      </form>
    </div>
  );
}

export default Register;