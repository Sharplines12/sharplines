"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { CasinoCumulativePoint } from "@/lib/casino-performance";

type CasinoCumulativeChartProps = {
  title: string;
  copy: string;
  points: CasinoCumulativePoint[];
};

export function CasinoCumulativeChart({ title, copy, points }: CasinoCumulativeChartProps) {
  const max = Math.max(...points.map((point) => Math.abs(point.net)), 1);

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
                  className={cn("h-full rounded-full", point.net >= 0 ? "bg-neon" : "bg-rose-300")}
                  style={{ width: `${Math.max((Math.abs(point.net) / max) * 100, 8)}%` }}
                />
              </div>
              <p className={cn("mt-4 text-xl uppercase", point.net >= 0 ? "text-neon" : "text-rose-200")}>
                {formatCurrency(point.net)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-mist/60">Not enough sessions yet to draw a cumulative bankroll trend.</p>
        )}
      </div>
    </div>
  );
}
