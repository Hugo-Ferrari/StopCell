import { type LucideIcon, ChevronRight } from "lucide-react";

export interface SettingCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass: string;
  badge?: string;
  onClick?: () => void;
}

export function SettingCard({
  title,
  description,
  icon: Icon,
  iconColorClass,
  badge,
  onClick,
}: SettingCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="w-full group relative flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-card/80 cursor-pointer"
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div
          className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${iconColorClass}`}
        >
          <Icon size={24} className="sm:w-7 sm:h-7" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white transition-colors group-hover:text-white">
              {title}
            </h3>
            {badge && (
              <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-400 border border-zinc-700/50">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center pl-2">
        <ChevronRight
          size={20}
          className="text-zinc-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
        />
      </div>
    </div>
  );
}

export default SettingCard;
