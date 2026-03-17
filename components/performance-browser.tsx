"use client";

import { useMemo, useState } from "react";
import type { DailyCard, UserBet } from "@/lib/data";
import { buildSharplinesPerformance, buildUserPerformance, listSupportedSports, type PerformanceSnapshot, type TimeframeKey } from "@/lib/performance";
import { cn, formatUnits } from "@/lib/utils";
import { ResultPill } from "@/components/result-pill";

type PerformanceBrowserProps = {
  cards: DailyCard[];
  userBets?: UserBet[];
  compareMode?: boolean;
  title?: string;
  copy?: string;
};

function SummaryCards({ snapshot }: { snapshot: PerformanceSnapshot }) {
  const cards = [
    { label: "All-time record", value: `${snapshot.wins}-${snapshot.losses}-${snapshot.pushes}` },
    { label: "Win rate", value: `${snapshot.winRate.toFixed(1)}%` },
    { label: "Units", value: formatUnits(snapshot.units), positive: snapshot.units >= 0 },
    { label: "ROI", value: `${snapshot.roi.toFixed(1)}%`, positive: snapshot.roi >= 0 },
    { label: "Units risked", value: `${snapshot.totalRisked.toFixed(1)}u` },
    { label: "Average odds", value: snapshot.averageOdds ? `${snapshot.averageOdds > 0 ? "+" : ""}${snapshot.averageOdds.toFixed(0)}` : "N/A" },
    { label: "Average stake", value: `${snapshot.averageStake.toFixed(2)}u` },
    { label: "Total bets", value: String(snapshot.totalBets) }
  ];

  return (
    <div className="data-grid">
      {cards.map((item) => (
        <div key={item.label} className="panel p-4">
          <p className="muted-label">{item.label}</p>
          <p className={cn("mt-2 text-3xl uppercase text-white", item.positive === true && "text-neon", item.positive === false && "text-rose-200")}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function BreakdownTable({ rows, heading }: { rows: PerformanceSnapshot["bySport"]; heading: string }) {
  return (
    <div className="panel p-6">
      <p className="muted-label">{heading}</p>
      <div className="mt-5 space-y-3">
        {rows.length ? (
          rows.map((row) => (
            <div key={`${heading}-${row.label}`} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{row.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist/45">
                    {row.wins}-{row.losses}-{row.pushes} • {row.totalBets} graded bets
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-medium", row.units >= 0 ? "text-neon" : "text-rose-200")}>{formatUnits(row.units)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist/45">{row.roi.toFixed(1)}% ROI</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-mist/60">No results match this filter yet.</p>
        )}
      </div>
    </div>
  );
}

function RecentForm({ form }: { form: PerformanceSnapshot["recentForm"] }) {
  return (
    <div className="panel p-6">
      <p className="muted-label">Recent form</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {form.length ? form.map((result, index) => <ResultPill key={`${result}-${index}`} result={result} />) : <p className="text-sm text-mist/60">No graded picks yet.</p>}
      </div>
    </div>
  );
}

export function PerformanceBrowser({ cards, userBets = [], compareMode = false, title, copy }: PerformanceBrowserProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("all");
  const [sport, setSport] = useState("All sports");
  const sports = useMemo(() => ["All sports", ...listSupportedSports(cards, userBets)], [cards, userBets]);

  const sharplines = useMemo(() => buildSharplinesPerformance(cards, timeframe, sport), [cards, timeframe, sport]);
  const userSnapshot = useMemo(() => buildUserPerformance(userBets, timeframe, sport), [sport, timeframe, userBets]);

  return (
    <div className="space-y-6">
      <div className="panel-strong p-6 sm:p-8">
        <p className="muted-label">{compareMode ? "Compare" : "Performance"}</p>
        <h2 className="mt-2 text-4xl uppercase text-white">
          {title || (compareMode ? "Measure your card against Sharplines." : "Transparent performance stays public.")}
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          {copy ||
            "Use timeframe and sport filters to review Sharplines results in a cleaner, data-driven way. Past performance stays visible so the product feels accountable, not selective."}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Timeframe</label>
            <select className="glass-input" value={timeframe} onChange={(event) => setTimeframe(event.target.value as TimeframeKey)}>
              <option value="7d" className="bg-ink text-white">Last 7 days</option>
              <option value="30d" className="bg-ink text-white">Last 30 days</option>
              <option value="mtd" className="bg-ink text-white">Month to date</option>
              <option value="all" className="bg-ink text-white">All time</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sport</label>
            <select className="glass-input" value={sport} onChange={(event) => setSport(event.target.value)}>
              {sports.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {compareMode ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-5">
            <div className="panel p-6">
              <p className="muted-label">Sharplines performance</p>
              <h3 className="mt-2 text-3xl uppercase text-white">Public card record</h3>
            </div>
            <SummaryCards snapshot={sharplines} />
          </div>
          <div className="space-y-5">
            <div className="panel p-6">
              <p className="muted-label">Your performance</p>
              <h3 className="mt-2 text-3xl uppercase text-white">Manual bet tracker</h3>
            </div>
            <SummaryCards snapshot={userSnapshot} />
          </div>
        </div>
      ) : (
        <SummaryCards snapshot={sharplines} />
      )}

      {compareMode ? (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            <RecentForm form={sharplines.recentForm} />
            <RecentForm form={userSnapshot.recentForm} />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.bySport} heading="Sharplines by sport" />
            <BreakdownTable rows={userSnapshot.bySport} heading="Your card by sport" />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.byLeague} heading="Sharplines by league" />
            <BreakdownTable rows={userSnapshot.byLeague} heading="Your card by league" />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.byMonth} heading="Sharplines monthly" />
            <BreakdownTable rows={userSnapshot.byMonth} heading="Your monthly" />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <RecentForm form={sharplines.recentForm} />
            <BreakdownTable rows={sharplines.bySport} heading="By sport" />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.byLeague} heading="By league" />
            <BreakdownTable rows={sharplines.byMonth} heading="Monthly breakdown" />
          </div>
        </>
      )}
    </div>
  );
}
