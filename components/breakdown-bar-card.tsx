"use client";

import { cn, formatUnits } from "@/lib/utils";
import type { MetricRow } from "@/lib/performance";

type BreakdownMetric = "units" | "roi" | "winRate";

type BreakdownBarCardProps = {
  title: string;
  copy: string;
  rows: MetricRow[];
  metric: BreakdownMetric;
};

export function BreakdownBarCard({ title, copy, rows, metric }: BreakdownBarCardProps) {
  const visibleRows = rows.slice(0, 6);
  const max = Math.max(
    ...visibleRows.map((row) => Math.abs(metric === "units" ? row.units : metric === "roi" ? row.roi : row.winRate)),
    1
  );

  return (
    <div className="panel p-6">
      <p className="muted-label">{title}</p>
      <p className="mt-4 text-sm leading-7 text-mist/70">{copy}</p>
      <div className="mt-6 space-y-4">
        {visibleRows.length ? (
          visibleRows.map((row) => {
            const value = metric === "units" ? row.units : metric === "roi" ? row.roi : row.winRate;

            return (
              <div key={`${title}-${row.label}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white">{row.label}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-mist/45">
                      {row.wins}-{row.losses}-{row.pushes}
                    </p>
                  </div>
                  <p className={cn("text-sm font-medium", value >= 0 ? "text-neon" : "text-rose-200")}>
                    {metric === "units" ? formatUnits(value) : `${value.toFixed(1)}${metric === "roi" || metric === "winRate" ? "%" : ""}`}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn("h-full rounded-full", value >= 0 ? "bg-neon" : "bg-rose-300")}
                    style={{ width: `${Math.max((Math.abs(value) / max) * 100, 8)}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-mist/60">No settled bets match this filter yet.</p>
        )}
      </div>
    </div>
  );
}
