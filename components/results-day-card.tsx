import type { DailyCard } from "@/lib/data";
import { cn } from "@/lib/utils";

type ResultsDayCardProps = {
  day: DailyCard;
  compact?: boolean;
};

export function ResultsDayCard({ day, compact = false }: ResultsDayCardProps) {
  return (
    <div className={cn("panel p-6", compact ? "h-full" : "")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="muted-label">{day.date}</p>
          <h3 className="mt-2 text-3xl uppercase text-white">{day.headline}</h3>
          <p className="mt-3 text-sm">{day.summary}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-mist/70">
          {day.recordLabel}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {day.picks.map((pick) => (
          <div key={pick.id} className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{pick.event}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist/45">
                  {pick.market} • {pick.line} • {pick.units.toFixed(1)}u
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                  pick.result === "win" && "bg-neon/10 text-neon",
                  pick.result === "loss" && "bg-rose-400/10 text-rose-200",
                  pick.result === "push" && "bg-aqua/10 text-aqua",
                  pick.result === "pending" && "bg-white/[0.04] text-mist/65"
                )}
              >
                {pick.result}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
