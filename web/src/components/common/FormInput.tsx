import { type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  helperText?: string;
}

function FormInput({
  label,
  icon,
  rightElement,
  error,
  helperText,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs sm:text-sm font-medium text-foreground">
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
          {...props}
          className={`w-full rounded-xl border border-border bg-background py-2.5 ${
            icon ? "pl-11" : "pl-3.5"
          } pr-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed ${
            error ? "border-destructive focus:border-destructive" : ""
          } ${className ?? ""}`}
        />
      </div>

      {error ? (
        <span className="text-xs text-destructive">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      ) : null}
    </div>
  );
}

export default FormInput;