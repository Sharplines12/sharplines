"use client";

import { cn } from "@/lib/utils";

type DistributionCardProps = {
  title: string;
  copy: string;
  items: Array<{ label: string; value: number; tone: "neon" | "rose" | "mist" }>;
};

export function DistributionCard({ title, copy, items }: DistributionCardProps) {
  const total = Math.max(items.reduce((sum, item) => sum + item.value, 0), 1);

  return (
    <div className="panel p-6">
      <p className="muted-label">{title}</p>
      <p className="mt-4 text-sm leading-7 text-mist/70">{copy}</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={`${title}-${item.label}`}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-white">{item.label}</span>
              <span className={cn(item.tone === "neon" && "text-neon", item.tone === "rose" && "text-rose-200", item.tone === "mist" && "text-mist/70")}>
                {item.value}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn(
                  "h-full rounded-full",
                  item.tone === "neon" && "bg-neon",
                  item.tone === "rose" && "bg-rose-300",
                  item.tone === "mist" && "bg-mist/50"
                )}
                style={{ width: `${Math.max((item.value / total) * 100, item.value ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
