"use client";

import type { ReactNode } from "react";
import type { DateRangeFilter, TimeframeKey } from "@/lib/performance";

type FilterOption = {
  value: string;
  label: string;
};

type AnalyticsFilterBarProps = {
  timeframe: TimeframeKey;
  onTimeframeChange: (value: TimeframeKey) => void;
  sport: string;
  onSportChange: (value: string) => void;
  sports: string[];
  range?: DateRangeFilter;
  onRangeChange?: (next: DateRangeFilter) => void;
  premiumUser?: boolean;
  timeframeOptions?: FilterOption[];
  children?: ReactNode;
};

export function AnalyticsFilterBar({
  timeframe,
  onTimeframeChange,
  sport,
  onSportChange,
  sports,
  range,
  onRangeChange,
  premiumUser = false,
  timeframeOptions = [
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "mtd", label: "This month" },
    { value: "ytd", label: "YTD" },
    { value: "all", label: "All time" },
    { value: "custom", label: "Custom range" }
  ],
  children
}: AnalyticsFilterBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Timeframe</label>
        <select className="glass-input" value={timeframe} onChange={(event) => onTimeframeChange(event.target.value as TimeframeKey)}>
          {timeframeOptions
            .filter((option) => premiumUser || option.value !== "custom")
            .map((option) => (
              <option key={option.value} value={option.value} className="bg-ink text-white">
                {option.label}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sport</label>
        <select className="glass-input" value={sport} onChange={(event) => onSportChange(event.target.value)}>
          {sports.map((option) => (
            <option key={option} value={option} className="bg-ink text-white">
              {option}
            </option>
          ))}
        </select>
      </div>

      {premiumUser && timeframe === "custom" ? (
        <>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Start date</label>
            <input
              type="date"
              className="glass-input"
              value={range?.start || ""}
              onChange={(event) => onRangeChange?.({ ...range, start: event.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">End date</label>
            <input
              type="date"
              className="glass-input"
              value={range?.end || ""}
              onChange={(event) => onRangeChange?.({ ...range, end: event.target.value })}
            />
          </div>
        </>
      ) : null}

      {children}
    </div>
  );
}
