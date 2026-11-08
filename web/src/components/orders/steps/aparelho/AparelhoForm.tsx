import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import CampoSelect, { type OpcaoSelect } from "@/components/common/CampoSelect";
import { atualizarAparelho, criarAparelho, type AparelhoDoCliente, type AparelhoDto } from "@/services/deviceService";
import { mensagemDeErro } from "@/utils/apiError";
import PadraoDesbloqueio from "./PadraoDesbloqueio";
import { pedeSenhaDigitada, semTextoDeVazio, TIPOS_SENHA } from "./aparelhoUtils";

interface AparelhoFormProps {
  cpfCliente: string;
  // com aparelho, o formulário vem preenchido e o IMEI fica travado
  aparelho?: AparelhoDoCliente;
  categorias: OpcaoSelect<number>[];
  marcas: OpcaoSelect<number>[];
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  onConfirmado: (imei: string) => void;
  onCancelar?: () => void;
}

const OPCOES_TIPO_SENHA = TIPOS_SENHA.map((tipo) => ({ value: tipo, label: tipo }));

const classeInput =
  "w-full rounded-xl border border-border bg-background p-4 text-foreground outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60";

function AparelhoForm({
  cpfCliente,
  aparelho,
  categorias,
  marcas,
  mostrarToast,
  onConfirmado,
  onCancelar,
}: AparelhoFormProps) {
  const existente = Boolean(aparelho);

  const [imei, setImei] = useState(aparelho?.imei ?? "");
  const [idCategoria, setIdCategoria] = useState<number | null>(aparelho?.idCategoria ?? null);
  const [idMarca, setIdMarca] = useState<number | null>(aparelho?.idMarca ?? null);
  const [modelo, setModelo] = useState(semTextoDeVazio(aparelho?.modelo));
  const [cor, setCor] = useState(semTextoDeVazio(aparelho?.cor));
  const [tipoSenha, setTipoSenha] = useState<string | null>(semTextoDeVazio(aparelho?.tipoSenha) || null);
  const [senha, setSenha] = useState(semTextoDeVazio(aparelho?.senhaAparelho));
  const [salvando, setSalvando] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);

  function montarDto(): AparelhoDto {
    return {
      imei: imei.trim(),
      cpfCliente,
      idCategoria: idCategoria!,
      idMarca: idMarca!,
      // a API não aceita campo vazio, então os opcionais vão com um texto padrão
      modelo: modelo.trim() || "Não informado",
      cor: cor.trim() || "Não informada",
      tipoSenha: tipoSenha || "Não informada",
      senhaAparelho: senha || "Não possui",
    };
  }

  // só chama a API se o técnico mudou alguma coisa no aparelho que já existia
  function mudouAlgo(dto: AparelhoDto) {
    if (!aparelho) return true;
    return (
      dto.idCategoria !== aparelho.idCategoria ||
      dto.idMarca !== aparelho.idMarca ||
      dto.modelo !== (aparelho.modelo ?? "") ||
      dto.cor !== (aparelho.cor ?? "") ||
      dto.tipoSenha !== (aparelho.tipoSenha ?? "") ||
      dto.senhaAparelho !== (aparelho.senhaAparelho ?? "")
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTentouEnviar(true);

    if (!imei.trim() || idCategoria === null || idMarca === null) {
      return mostrarToast("Preencha IMEI, categoria e marca.", "erro");
    }

    const dto = montarDto();

    try {
      setSalvando(true);

      if (!existente) {
        await criarAparelho(dto);
      } else if (mudouAlgo(dto)) {
        await atualizarAparelho(dto.imei, dto);
      }

      mostrarToast(existente ? "Aparelho confirmado." : "Aparelho cadastrado.", "sucesso");
      onConfirmado(dto.imei);
    } catch (error) {
      mostrarToast(mensagemDeErro(error, "Não foi possível salvar o aparelho."), "erro");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-4 animate-in fade-in slide-in-from-top-2 md:p-6"
    >
      <h3 className="font-semibold text-foreground">
        {existente ? "Confira os dados do aparelho" : "Cadastrar novo aparelho"}
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="imei" className="flex justify-between text-xs font-bold text-foreground md:text-sm">
            <span>IMEI / Nº de Série *</span>
            {existente && (
              <span className="flex items-center gap-1 font-normal text-muted-foreground">
                <Lock className="size-3" /> não muda
              </span>
            )}
          </label>
          <input
            id="imei"
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            disabled={existente}
            placeholder="Digite o IMEI ou Nº de Série"
            aria-invalid={tentouEnviar && !imei.trim()}
            className={`${classeInput} aria-invalid:border-destructive`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="categoria" className="text-xs font-bold text-foreground md:text-sm">
            Categoria *
          </label>
          <CampoSelect
            id="categoria"
            value={idCategoria}
            opcoes={categorias}
            onChange={setIdCategoria}
            invalido={tentouEnviar && idCategoria === null}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="marca" className="text-xs font-bold text-foreground md:text-sm">
            Marca *
          </label>
          <CampoSelect
            id="marca"
            value={idMarca}
            opcoes={marcas}
            onChange={setIdMarca}
            invalido={tentouEnviar && idMarca === null}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="modelo" className="text-xs font-bold text-foreground md:text-sm">
            Modelo / Descrição
          </label>
          <input
            id="modelo"
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Ex: iPhone 13 Pro Max"
            className={classeInput}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cor" className="text-xs font-bold text-foreground md:text-sm">
            Cor
          </label>
          <input
            id="cor"
            type="text"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            placeholder="Ex: Preto, Azul"
            className={classeInput}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="tipo-senha" className="text-xs font-bold text-foreground md:text-sm">
            Tipo de senha
          </label>
          <CampoSelect
            id="tipo-senha"
            value={tipoSenha}
            opcoes={OPCOES_TIPO_SENHA}
            onChange={(tipo) => {
              setTipoSenha(tipo);
              setSenha("");
            }}
            placeholder="Selecione o tipo de bloqueio..."
          />
        </div>

        {tipoSenha && pedeSenhaDigitada(tipoSenha) && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 md:col-span-2">
            <label htmlFor="senha" className="text-xs font-bold text-primary md:text-sm">
              Senha do aparelho
            </label>
            <input
              id="senha"
              type="text"
              inputMode={tipoSenha === "Numérica (PIN)" ? "numeric" : "text"}
              value={senha}
              onChange={(e) =>
                setSenha(tipoSenha === "Numérica (PIN)" ? e.target.value.replace(/\D/g, "") : e.target.value)
              }
              placeholder="Digite a senha de desbloqueio"
              className="w-full rounded-xl border border-primary/30 bg-primary/10 p-4 text-foreground outline-none focus:border-primary"
            />
          </div>
        )}

        {tipoSenha === "Padrão (Desenho)" && <PadraoDesbloqueio valor={senha} onChange={setSenha} />}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-2xl px-6 py-4 font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={salvando}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {salvando && <Loader2 className="size-5 animate-spin" />}
          {existente ? "Usar este aparelho" : "Cadastrar aparelho"}
        </button>
      </div>
    </form>
  );
}

export default AparelhoForm;