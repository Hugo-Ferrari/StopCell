interface AlertProps {
  mensagem?: string | null;
  tipo?: "erro" | "sucesso";
}

const estilos = {
  erro: "border-destructive/30 bg-destructive/10 text-destructive",
  sucesso: "border-success/30 bg-success/10 text-success",
};

function Alert({ mensagem, tipo = "erro" }: AlertProps) {
  if (!mensagem) return null;

  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={`whitespace-pre-line rounded-lg border px-4 py-3 text-sm ${estilos[tipo]}`}
    >
      {mensagem}
    </div>
  );
}

export default Alert;