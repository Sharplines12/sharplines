import { cn } from "@/lib/utils";
import type { PickResult } from "@/lib/data";

type ResultPillProps = {
  result: PickResult;
  className?: string;
};

export function ResultPill({ result, className }: ResultPillProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        result === "win" && "bg-neon/10 text-neon",
        result === "loss" && "bg-rose-400/10 text-rose-200",
        result === "push" && "bg-aqua/10 text-aqua",
        result === "pending" && "bg-white/[0.04] text-mist/65",
        className
      )}
    >
      {result}
    </span>
  );
}
