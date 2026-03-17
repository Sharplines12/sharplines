"use client";

import { useMemo, useState } from "react";
import type { DailyCard, UserBet } from "@/lib/data";
import {
  buildSharplinesPerformance,
  buildUserPerformance,
  listSupportedSports,
  type DateRangeFilter,
  type PerformanceSnapshot,
  type TimeframeKey
} from "@/lib/performance";
import { cn, formatUnits } from "@/lib/utils";
import { ResultPill } from "@/components/result-pill";
import { PerformanceTrendChart } from "@/components/performance-trend-chart";
import { AnalyticsFilterBar } from "@/components/analytics-filter-bar";
import { CumulativeUnitsChart } from "@/components/cumulative-units-chart";
import { DistributionCard } from "@/components/distribution-card";
import { BreakdownBarCard } from "@/components/breakdown-bar-card";

type PerformanceBrowserProps = {
  cards: DailyCard[];
  userBets?: UserBet[];
  compareMode?: boolean;
  title?: string;
  copy?: string;
  premiumUser?: boolean;
};

function SummaryCards({ snapshot }: { snapshot: PerformanceSnapshot }) {
  const cards = [
    { label: "All-time record", value: `${snapshot.wins}-${snapshot.losses}-${snapshot.pushes}` },
    { label: "Win rate", value: `${snapshot.winRate.toFixed(1)}%` },
    { label: "Units", value: formatUnits(snapshot.units), positive: snapshot.units >= 0 },
    { label: "ROI", value: `${snapshot.roi.toFixed(1)}%`, positive: snapshot.roi >= 0 },
    { label: "Settled bets", value: String(snapshot.settledCount) },
    { label: "Units risked", value: `${snapshot.totalRisked.toFixed(1)}u` },
    { label: "Average odds", value: snapshot.averageOdds ? `${snapshot.averageOdds > 0 ? "+" : ""}${snapshot.averageOdds.toFixed(0)}` : "N/A" },
    { label: "Average stake", value: `${snapshot.averageStake.toFixed(2)}u` },
    { label: "Total bets", value: String(snapshot.totalBets) },
    { label: "Current streak", value: snapshot.currentStreak.label },
    { label: "Longest win streak", value: `${snapshot.longestWinStreak}` },
    { label: "Longest loss streak", value: `${snapshot.longestLossStreak}` },
    { label: "Pending / settled", value: `${snapshot.pendingCount} / ${snapshot.settledCount}` }
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

export function PerformanceBrowser({ cards, userBets = [], compareMode = false, title, copy, premiumUser = false }: PerformanceBrowserProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("all");
  const [sport, setSport] = useState("All sports");
  const [range, setRange] = useState<DateRangeFilter>({});
  const sports = useMemo(() => ["All sports", ...listSupportedSports(cards, userBets)], [cards, userBets]);

  const sharplines = useMemo(() => buildSharplinesPerformance(cards, timeframe, sport, range), [cards, timeframe, sport, range]);
  const userSnapshot = useMemo(() => buildUserPerformance(userBets, timeframe, sport, range), [sport, timeframe, userBets, range]);

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
        <div className="mt-6">
          <AnalyticsFilterBar
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            sport={sport}
            onSportChange={setSport}
            sports={sports}
            range={range}
            onRangeChange={setRange}
            premiumUser
          />
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
            <PerformanceTrendChart
              rows={sharplines.byMonth}
              title="Sharplines trend"
              copy="Monthly units help show whether the card is trending in a disciplined direction over time instead of hiding behind isolated screenshots."
            />
            <PerformanceTrendChart
              rows={userSnapshot.byMonth}
              title="Your trend"
              copy="Your monthly tracker lets you compare habits, results, and consistency against the Sharplines public record."
              accent="aqua"
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <CumulativeUnitsChart
              title="Sharplines cumulative units"
              copy="This view shows how the public card has compounded over the selected window."
              points={sharplines.cumulativeUnits}
            />
            <CumulativeUnitsChart
              title="Your cumulative units"
              copy="Your tracked record compounds here the same way so the comparison is not limited to headline percentages."
              points={userSnapshot.cumulativeUnits}
              accent="aqua"
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <RecentForm form={sharplines.recentForm} />
            <RecentForm form={userSnapshot.recentForm} />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <DistributionCard
              title="Sharplines distribution"
              copy="Wins, losses, pushes, and pending bets stay visible so the record tells the full story."
              items={sharplines.winLossDistribution}
            />
            <DistributionCard
              title="Your distribution"
              copy="Your tracker keeps the same result breakdown so comparison stays apples-to-apples."
              items={userSnapshot.winLossDistribution}
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.bySport} heading="Sharplines by sport" />
            <BreakdownTable rows={userSnapshot.bySport} heading="Your card by sport" />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.byLeague} heading="Sharplines by league" />
            <BreakdownTable rows={userSnapshot.byLeague} heading="Your card by league" />
          </div>
          {premiumUser ? (
            <>
              <div className="grid gap-5 xl:grid-cols-2">
                <BreakdownBarCard
                  rows={sharplines.byBetType}
                  title="Sharplines by bet type"
                  copy="Spread, total, moneyline, and props each carry their own performance profile."
                  metric="units"
                />
                <BreakdownBarCard
                  rows={userSnapshot.byBetType}
                  title="Your card by bet type"
                  copy="Use this to see whether your own edge is concentrated in one bet family."
                  metric="units"
                />
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <BreakdownTable rows={sharplines.byMonth} heading="Sharplines monthly" />
                <BreakdownTable rows={userSnapshot.byMonth} heading="Your monthly" />
              </div>
            </>
          ) : (
            <div className="panel rounded-[28px] border border-aqua/20 bg-aqua/10 p-6">
              <p className="muted-label">Premium compare layer</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/80">
                Premium unlocks the deeper compare view, including custom date ranges, bet-type breakdowns, and expanded month-by-month review against Sharplines.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <PerformanceTrendChart
            rows={sharplines.byMonth}
            title="Units over time"
            copy="A public trend view makes it easier to judge whether Sharplines has been steady over time instead of selectively highlighting a short hot stretch."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            <CumulativeUnitsChart
              title="Cumulative units"
              copy="The cumulative view adds context to the monthly breakdown and makes longer-term direction easier to evaluate."
              points={sharplines.cumulativeUnits}
            />
            <DistributionCard
              title="Win / loss mix"
              copy="The result mix stays visible so the public record does not hide behind a single summary number."
              items={sharplines.winLossDistribution}
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <RecentForm form={sharplines.recentForm} />
            <BreakdownTable rows={sharplines.bySport} heading="By sport" />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownTable rows={sharplines.byLeague} heading="By league" />
            <BreakdownTable rows={sharplines.byMonth} heading="Monthly breakdown" />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <BreakdownBarCard
              rows={sharplines.bySportsbook}
              title="Performance by sportsbook"
              copy="Book-level review helps show where the card was actually posted and tracked."
              metric="roi"
            />
            <BreakdownBarCard
              rows={sharplines.byBetType}
              title="Performance by bet type"
              copy="Different markets behave differently over time, so this breakdown helps add useful context."
              metric="units"
            />
          </div>
        </>
      )}
    </div>
  );
}
