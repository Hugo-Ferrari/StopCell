import { type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  helperText?: string;
  inputSize?: "md" | "lg";
}

// md é o que já era usado no sistema, lg é o das telas de login/recuperação
const tamanhos = {
  md: {
    label: "text-xs sm:text-sm font-medium",
    input: "rounded-xl bg-background py-2.5 text-sm",
    comIcone: "pl-11",
    icone: "left-3.5",
  },
  lg: {
    label: "text-sm sm:text-base font-semibold",
    input: "rounded-2xl bg-[var(--surface)] py-4 text-base",
    comIcone: "pl-12",
    icone: "left-4",
  },
};

function FormInput({
  label,
  icon,
  rightElement,
  error,
  helperText,
  inputSize = "md",
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");
  const mensagemId = `${inputId}-mensagem`;
  const t = tamanhos[inputSize];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className={`${t.label} text-foreground`}>
          {label}
        </label>
        {rightElement}
      </div>

      <div className="relative flex items-center">
        {icon && (
          <span className={`absolute ${t.icone} text-muted-foreground pointer-events-none`}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          // liga o input à mensagem de erro pro leitor de tela
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helperText ? mensagemId : undefined}
          {...props}
          className={`w-full border border-border ${t.input} ${
            icon ? t.comIcone : "pl-3.5"
          } pr-3.5 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed ${
            error ? "border-destructive focus:border-destructive" : ""
          } ${className ?? ""}`}
        />
      </div>

      {error ? (
        <span id={mensagemId} className="text-xs text-destructive">{error}</span>
      ) : helperText ? (
        <span id={mensagemId} className="text-xs text-muted-foreground">{helperText}</span>
      ) : null}
    </div>
  );
}

export default FormInput;