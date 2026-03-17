"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { CasinoMetricRow } from "@/lib/casino-performance";

type CasinoTrendChartProps = {
  title: string;
  copy: string;
  rows: CasinoMetricRow[];
};

export function CasinoTrendChart({ title, copy, rows }: CasinoTrendChartProps) {
  const points = [...rows].reverse().slice(-6);
  const max = Math.max(...points.map((row) => Math.abs(row.net)), 1);

  return (
    <div className="panel p-6">
      <p className="muted-label">{title}</p>
      <p className="mt-4 text-sm leading-7 text-mist/70">{copy}</p>
      <div className="mt-6 flex min-h-[220px] items-end gap-3">
        {points.length ? (
          points.map((row) => {
            const height = Math.max((Math.abs(row.net) / max) * 160, 14);
            const positive = row.net >= 0;

            return (
              <div key={`${title}-${row.label}`} className="flex flex-1 flex-col items-center gap-3">
                <p className={cn("text-xs font-medium", positive ? "text-neon" : "text-rose-200")}>{formatCurrency(row.net)}</p>
                <div className="flex h-[168px] items-end">
                  <div
                    className={cn(
                      "w-full min-w-[34px] rounded-t-[18px] border border-white/10 bg-gradient-to-t",
                      positive && "from-neon/25 to-neon/80",
                      !positive && "from-rose-500/20 to-rose-300/75"
                    )}
                    style={{ height }}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.16em] text-mist/45">{row.label}</p>
                  <p className="mt-1 text-[11px] text-mist/60">{row.sessions} sessions</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-mist/60">
            Not enough casino sessions yet to draw a monthly trend.
          </div>
        )}
      </div>
    </div>
  );
}
