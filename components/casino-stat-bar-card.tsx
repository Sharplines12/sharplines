"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { CasinoMetricRow } from "@/lib/casino-performance";

type CasinoStatBarCardProps = {
  title: string;
  copy: string;
  rows: CasinoMetricRow[];
  metric: "net" | "average" | "sessions";
};

export function CasinoStatBarCard({ title, copy, rows, metric }: CasinoStatBarCardProps) {
  const visibleRows = rows.slice(0, 6);
  const max = Math.max(
    ...visibleRows.map((row) => Math.abs(metric === "net" ? row.net : metric === "average" ? row.averageResult : row.sessions)),
    1
  );

  return (
    <div className="panel p-6">
      <p className="muted-label">{title}</p>
      <p className="mt-4 text-sm leading-7 text-mist/70">{copy}</p>
      <div className="mt-6 space-y-4">
        {visibleRows.length ? (
          visibleRows.map((row) => {
            const value = metric === "net" ? row.net : metric === "average" ? row.averageResult : row.sessions;

            return (
              <div key={`${title}-${row.label}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white">{row.label}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-mist/45">
                      {row.sessions} sessions • {formatCurrency(row.buyIn)} in • {formatCurrency(row.cashOut)} out
                    </p>
                  </div>
                  <p className={cn("text-sm font-medium", metric === "sessions" ? "text-white" : value >= 0 ? "text-neon" : "text-rose-200")}>
                    {metric === "sessions" ? String(value) : formatCurrency(Number(value))}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn("h-full rounded-full", metric === "sessions" ? "bg-aqua" : value >= 0 ? "bg-neon" : "bg-rose-300")}
                    style={{ width: `${Math.max((Math.abs(Number(value)) / max) * 100, 8)}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-mist/60">No casino sessions match this filter yet.</p>
        )}
      </div>
    </div>
  );
}
