import { useState, type FormEvent } from "react";
import { House, IdCard, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { useViaCep } from "@/hooks/useViaCep";
import { criandoCliente, type criarClienteDto } from "@/services/customerService";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarCep, formatarCpf, formatarTelefone } from "@/utils/masks";
import { cpfValido, emailValido, telefoneValido } from "@/utils/validartors";

interface NewCustomerProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  setAbaAtiva: (aba: "existente" | "novo") => void;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

type Campo = "nome" | "cpf" | "whatsapp" | "email" | "endereco";

export default function NewCustomer({ mostrarToast, setAbaAtiva, setClienteSelecionado }: NewCustomerProps) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});

  const { buscarCep, carregandoCep, erroCep } = useViaCep();

  const cpfLimpo = cpf.replace(/\D/g, "");
  const whatsLimpo = whatsapp.replace(/\D/g, "");

  const erros: Record<Campo, string | undefined> = {
    nome: !nome.trim() ? "Informe o nome do cliente" : undefined,
    cpf:
      cpfLimpo.length < 11
        ? "Digite os 11 números do CPF"
        : !cpfValido(cpfLimpo)
          ? "Esse CPF não é válido. Confira os números."
          : undefined,
    whatsapp: !telefoneValido(whatsLimpo) ? "Digite o DDD e o número" : undefined,
    email: !emailValido(email.trim()) ? "Digite um e-mail válido" : undefined,
    endereco: !endereco.trim() ? "Informe o endereço" : undefined,
  };

  // o erro aparece quando a pessoa sai do campo, ou em todos quando tenta salvar.
  // o CPF avisa assim que completa os 11 números, sem esperar sair do campo
  function erro(campo: Campo) {
    if (campo === "cpf" && cpfLimpo.length === 11) return erros.cpf;
    return tentouEnviar || tocados[campo] ? erros[campo] : undefined;
  }

  const tocar = (campo: Campo) => () => setTocados((atual) => ({ ...atual, [campo]: true }));

  async function handleCep(valor: string) {
    const formatado = formatarCep(valor);
    setCep(formatado);

    if (formatado.replace(/\D/g, "").length !== 8) return;

    const achado = await buscarCep(formatado);
    if (achado) setEndereco(`${achado.enderecoFormatado}, Nº `);
  }

  async function handleCadastrar(e: FormEvent) {
    e.preventDefault();
    setTentouEnviar(true);

    if (Object.values(erros).some(Boolean)) return;

    try {
      setSalvando(true);
      const criado = await criandoCliente({
        nmCompleto: nome.trim(),
        cpf: cpfLimpo,
        telefone: whatsLimpo,
        email: email.trim(),
        endereco: endereco.trim(),
      } as criarClienteDto);

      setClienteSelecionado({ ...criado, aparelhos: [] });
      mostrarToast("Cliente cadastrado.", "sucesso");
      setAbaAtiva("existente");
    } catch (error) {
      mostrarToast(mensagemDeErro(error, "Não foi possível cadastrar o cliente."), "erro");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleCadastrar}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-2 md:p-6"
    >
      <h2 className="font-semibold text-foreground">Dados do novo cliente</h2>

      <FormInput
        label="Nome completo *"
        icon={<User size={18} />}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onBlur={tocar("nome")}
        placeholder="Nome e sobrenome"
        autoComplete="off"
        error={erro("nome")}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="CPF *"
          icon={<IdCard size={18} />}
          inputMode="numeric"
          value={cpf}
          onChange={(e) => setCpf(formatarCpf(e.target.value))}
          onBlur={tocar("cpf")}
          placeholder="000.000.000-00"
          maxLength={14}
          error={erro("cpf")}
        />

        <FormInput
          label="WhatsApp *"
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
          label="E-mail *"
          icon={<Mail size={18} />}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={tocar("email")}
          placeholder="cliente@email.com"
          error={erro("email")}
          helperText="É pra onde vão os avisos de andamento da O.S."
        />

        <FormInput
          label="CEP"
          icon={<MapPin size={18} />}
          inputMode="numeric"
          value={cep}
          onChange={(e) => void handleCep(e.target.value)}
          placeholder="00000-000"
          maxLength={9}
          error={erroCep ?? undefined}
          helperText={carregandoCep ? "Buscando endereço..." : "Preenche o endereço sozinho"}
        />
      </div>

      <FormInput
        label="Endereço completo *"
        icon={<House size={18} />}
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
        onBlur={tocar("endereco")}
        placeholder="Rua, número, bairro, cidade"
        error={erro("endereco")}
      />

      <Button type="submit" disabled={salvando} className="h-12 rounded-xl px-8 md:self-end">
        {salvando && <Loader2 className="size-4 animate-spin" />}
        Cadastrar cliente
      </Button>
    </form>
  );
}