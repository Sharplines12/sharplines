"use client";

import type { DateRangeFilter, TimeframeKey } from "@/lib/performance";

const timeframeOptions: Array<{ value: TimeframeKey; label: string }> = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "mtd", label: "Month to date" },
  { value: "ytd", label: "YTD" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" }
];

type CasinoFilterBarProps = {
  timeframe: TimeframeKey;
  onTimeframeChange: (value: TimeframeKey) => void;
  range: DateRangeFilter;
  onRangeChange: (next: DateRangeFilter) => void;
  gameType: string;
  onGameTypeChange: (value: string) => void;
  gameTypes: string[];
  casinoApp: string;
  onCasinoAppChange: (value: string) => void;
  casinoApps: string[];
  premiumUser?: boolean;
  children?: React.ReactNode;
};

export function CasinoFilterBar({
  timeframe,
  onTimeframeChange,
  range,
  onRangeChange,
  gameType,
  onGameTypeChange,
  gameTypes,
  casinoApp,
  onCasinoAppChange,
  casinoApps,
  premiumUser = false,
  children
}: CasinoFilterBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Timeframe</label>
        <select className="glass-input" value={timeframe} onChange={(event) => onTimeframeChange(event.target.value as TimeframeKey)}>
          {timeframeOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-ink text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Game type</label>
        <select className="glass-input" value={gameType} onChange={(event) => onGameTypeChange(event.target.value)}>
          {gameTypes.map((option) => (
            <option key={option} value={option} className="bg-ink text-white">
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Casino app</label>
        <select
          className="glass-input"
          value={casinoApp}
          onChange={(event) => onCasinoAppChange(event.target.value)}
          disabled={!premiumUser}
        >
          {casinoApps.map((option) => (
            <option key={option} value={option} className="bg-ink text-white">
              {option}
            </option>
          ))}
        </select>
      </div>
      {children}
      {premiumUser && timeframe === "custom" ? (
        <>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Start date</label>
            <input
              type="date"
              className="glass-input"
              value={range.start || ""}
              onChange={(event) => onRangeChange({ ...range, start: event.target.value || undefined })}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">End date</label>
            <input
              type="date"
              className="glass-input"
              value={range.end || ""}
              onChange={(event) => onRangeChange({ ...range, end: event.target.value || undefined })}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
