// essa mensagem de erro é usada em vários lugares, então criei um componente separado pra ela
// esse arquivo substitui os alert() que a tela usava antes

interface AuthAlertProps {
  mensagem?: string | null;
  tipo?: "erro" | "sucesso";
}

const estilos = {
  erro: "border-destructive/30 bg-destructive/10 text-destructive",
  sucesso: "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]",
};

function AuthAlert({ mensagem, tipo = "erro" }: AuthAlertProps) {
  if (!mensagem) return null;

  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      // whitespace-pre-line pra quebrar linha quando a api manda vários erros
      className={`whitespace-pre-line rounded-xl border px-4 py-3 text-sm ${estilos[tipo]}`}
    >
      {mensagem}
    </div>
  );
}

export default AuthAlert;