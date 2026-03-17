"use client";

import { cn, formatUnits } from "@/lib/utils";
import type { CumulativePoint } from "@/lib/performance";

type CumulativeUnitsChartProps = {
  title: string;
  copy: string;
  points: CumulativePoint[];
  accent?: "neon" | "aqua";
};

export function CumulativeUnitsChart({
  title,
  copy,
  points,
  accent = "neon"
}: CumulativeUnitsChartProps) {
  const max = Math.max(...points.map((point) => Math.abs(point.units)), 1);

  return (
    <div className="panel p-6">
      <p className="muted-label">{title}</p>
      <p className="mt-4 text-sm leading-7 text-mist/70">{copy}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
        {points.length ? (
          points.map((point) => (
            <div key={`${title}-${point.date}`} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-mist/45">{point.label}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn(
                    "h-full rounded-full",
                    accent === "neon" ? "bg-neon" : "bg-aqua",
                    point.units < 0 && "bg-rose-300"
                  )}
                  style={{ width: `${Math.max((Math.abs(point.units) / max) * 100, 8)}%` }}
                />
              </div>
              <p className={cn("mt-4 text-xl uppercase", point.units >= 0 ? (accent === "neon" ? "text-neon" : "text-aqua") : "text-rose-200")}>
                {formatUnits(point.units)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-mist/60">Not enough settled bets yet to draw cumulative units.</p>
        )}
      </div>
    </div>
  );
}
