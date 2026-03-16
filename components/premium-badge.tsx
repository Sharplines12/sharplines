import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type PremiumBadgeProps = {
  label?: string;
  className?: string;
};

export function PremiumBadge({ label = "Premium", className }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon",
        className
      )}
    >
      <Crown className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
