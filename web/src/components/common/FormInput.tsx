import { type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

function FormInput({ label, icon, error, className, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-white">{label}</label>
      <div className="relative flex items-center">
        {icon && <span className="absolute left-4 text-zinc-500">{icon}</span>}
        <input
          {...props}
          className={`w-full bg-[#0A0A0A] border rounded-xl py-3.5 ${icon ? "pl-11" : "pl-4"} pr-4 text-white outline-none transition-colors ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#222222] focus:border-[#F25C38]"
          } ${className ?? ""}`}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default FormInput;