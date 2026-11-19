import { type LucideIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface SettingCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  badge?: string;
  iconColorClass?: string;
}

export function SettingCard({
  title,
  description,
  icon: Icon,
  to,
  badge,
  iconColorClass,
}: SettingCardProps) {
  return (
    <Link
      to={to}
      className="w-full group relative flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${
            iconColorClass ??
            "border-border bg-secondary text-primary group-hover:border-primary/30 group-hover:bg-primary/10"
          }`}
        >
          <Icon size={22} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            {badge && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center pl-2">
        <ChevronRight
          size={20}
          className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground"
        />
      </div>
    </Link>
  );
}

export default SettingCard;

