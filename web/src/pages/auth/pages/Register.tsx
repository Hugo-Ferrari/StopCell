import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import Marca from "@/components/common/Mark";
import FormInput from "@/components/common/FormInput";
import Alert from "@/components/common/Alert";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import { cadastrarUsuario } from "../authService";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarCnpj, formatarTelefone, limparCnpj } from "@/utils/masks";
import { cnpjValido, emailValido, telefoneValido } from "@/utils/validartors";

type Campo =
  | "nomeEmpresa"
  | "cnpj"
  | "cidade"
  | "nomeCompleto"
  | "whatsapp"
  | "email"
  | "usuario"
  | "senha"
  | "confirmarSenha";

function Register() {
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});

  // empresa
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");

  // dono
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // acesso
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const cnpjLimpo = limparCnpj(cnpj);
  const whatsLimpo = whatsapp.replace(/\D/g, "");

  const erros: Record<Campo, string | undefined> = {
    nomeEmpresa: !nomeEmpresa.trim() ? "Informe o nome da empresa" : undefined,
    cnpj: !cnpjLimpo
      ? "Informe o CNPJ da empresa"
      : cnpjLimpo.length < 14
        ? "O CNPJ tem 14 caracteres"
        : !cnpjValido(cnpjLimpo)
          ? "Esse CNPJ não é válido. Confira os dígitos."
          : undefined,
    cidade: !cidade.trim() ? "Informe a cidade" : undefined,
    nomeCompleto: !nomeCompleto.trim() ? "Informe o seu nome" : undefined,
    whatsapp: !telefoneValido(whatsLimpo) ? "Digite o DDD e o número" : undefined,
    email: !emailValido(email.trim()) ? "Digite um e-mail válido (ex: nome@dominio.com)" : undefined,
    usuario: !usuario.trim() ? "Escolha um nome de usuário" : undefined,
    senha: senha.length < 6 ? "A senha precisa ter pelo menos 6 caracteres" : undefined,
    confirmarSenha: confirmarSenha !== senha ? "As senhas não são iguais" : undefined,
  };

  // o erro de cada campo aparece quando a pessoa sai dele, ou em todos quando tenta enviar
  const erro = (campo: Campo) => (tentouEnviar || tocados[campo] ? erros[campo] : undefined);
  const tocar = (campo: Campo) => () => setTocados((atual) => ({ ...atual, [campo]: true }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTentouEnviar(true);
    setErroApi(null);

    if (Object.values(erros).some(Boolean)) return;

    setCarregando(true);
    try {
      await cadastrarUsuario({
        empresa: {
          nomeFantasia: nomeEmpresa.trim(),
          razaoSocial: nomeEmpresa.trim(),
          cnpj: cnpjLimpo,
          telefone: whatsLimpo,
          endereco: cidade.trim(),
        },
        usuario: {
          nome: nomeCompleto.trim(),
          login: usuario.trim(),
          emailUsuario: email.trim(),
          senha,
        },
      });

      navigate("/", {
        state: {
          email: email.trim(),
          mensagem: `Cadastro realizado com sucesso! A ${nomeEmpresa.trim()} já está no sistema. Entre com seu e-mail e senha.`,
        },
      });
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível criar a conta. Confira os dados e tente de novo."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-hidden bg-background p-4 text-foreground md:p-8">
      <div className="mb-6 flex w-full max-w-2xl justify-start md:mb-8">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft size={20} />
          <span>Voltar para o login</span>
        </Link>
      </div>

      <div className="mb-8 flex w-full max-w-2xl flex-col items-center text-center">
        <Marca size={120} />
        <h1 className="mt-6 mb-2 text-2xl font-bold md:text-3xl">Criar conta do dono</h1>
        <p className="max-w-md text-sm text-muted-foreground md:text-base">
          Cadastre a sua assistência técnica. O acesso ao sistema é exclusivo do dono da empresa.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-2xl flex-col gap-8 rounded-2xl border border-border bg-card p-5 md:p-6"
      >
        <section className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground">Empresa</h2>

          <FormInput
            label="Nome da empresa"
            icon={<Building2 size={18} />}
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            onBlur={tocar("nomeEmpresa")}
            placeholder="Ex: Stop Cell Assistência Técnica"
            error={erro("nomeEmpresa")}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
              onBlur={tocar("cnpj")}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              autoCapitalize="characters"
              error={erro("cnpj")}
            />
            <FormInput
              label="Cidade"
              icon={<MapPin size={18} />}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              onBlur={tocar("cidade")}
              placeholder="Ex: Franca"
              error={erro("cidade")}
            />
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground">Dono da empresa</h2>

          <FormInput
            label="Nome completo"
            icon={<User size={18} />}
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            onBlur={tocar("nomeCompleto")}
            placeholder="Digite o nome completo"
            error={erro("nomeCompleto")}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="WhatsApp"
              icon={<Phone size={18} />}
              type="tel"
              inputMode="numeric"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatarTelefone(e.target.value))}
              onBlur={tocar("whatsapp")}
              placeholder="(00) 00000-0000"
              maxLength={15}
              error={erro("whatsapp")}
            />
            <FormInput
              label="E-mail"
              icon={<Mail size={18} />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={tocar("email")}
              placeholder="contato@stopcell.com.br"
              error={erro("email")}
            />
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground">Acesso ao sistema</h2>

          <FormInput
            label="Usuário"
            icon={<User size={18} />}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onBlur={tocar("usuario")}
            placeholder="Ex: diogo"
            autoComplete="username"
            error={erro("usuario")}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="Senha"
              icon={<Lock size={18} />}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onBlur={tocar("senha")}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              error={erro("senha")}
            />
            <FormInput
              label="Confirmar senha"
              icon={<Lock size={18} />}
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              onBlur={tocar("confirmarSenha")}
              placeholder="Repita a senha"
              autoComplete="new-password"
              error={erro("confirmarSenha")}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <Alert mensagem={erroApi} />
          {tentouEnviar && Object.values(erros).some(Boolean) && (
            <p className="text-center text-sm text-destructive">Confira os campos marcados em vermelho.</p>
          )}
          <AuthSubmitButton carregando={carregando} textoCarregando="Criando conta...">
            Criar conta
          </AuthSubmitButton>
        </div>
      </form>
    </div>
  );
}

export default Register;