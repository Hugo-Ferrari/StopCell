import { type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  helperText?: string;
}

function FormInput({
  label,
  icon,
  rightElement,
  trailing,
  error,
  helperText,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");
  const mensagemId = `${inputId}-mensagem`;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs font-medium text-foreground sm:text-sm">
          {label}
        </label>
        {rightElement}
      </div>

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          // liga o input à mensagem de erro pro leitor de tela
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helperText ? mensagemId : undefined}
          {...props}
          className={`w-full rounded-xl border border-border bg-background py-2.5 text-sm ${icon ? "pl-11" : "pl-3.5"} ${
            trailing ? "pr-12" : "pr-3.5"
          } text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed ${
            error ? "border-destructive focus:border-destructive" : ""
          } ${className ?? ""}`}
        />
        {trailing && <span className="absolute right-1.5 flex items-center">{trailing}</span>}
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
