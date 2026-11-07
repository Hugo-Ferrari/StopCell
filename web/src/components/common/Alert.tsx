interface AlertProps {
  mensagem?: string | null;
  tipo?: "erro" | "sucesso";
}

const estilos = {
  erro: "border-destructive/30 bg-destructive/10 text-destructive",
  sucesso: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
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