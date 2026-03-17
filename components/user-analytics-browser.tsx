"use client";

import { useMemo, useState } from "react";
import type { DailyCard, UserBet } from "@/lib/data";
import { buildSharplinesPerformance, buildUserPerformance, listSupportedSports, type DateRangeFilter, type TimeframeKey } from "@/lib/performance";
import { formatCurrency, formatUnits } from "@/lib/utils";
import { AnalyticsFilterBar } from "@/components/analytics-filter-bar";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { BreakdownBarCard } from "@/components/breakdown-bar-card";
import { CumulativeUnitsChart } from "@/components/cumulative-units-chart";
import { DistributionCard } from "@/components/distribution-card";
import { PerformanceTrendChart } from "@/components/performance-trend-chart";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { BarChart3, CalendarClock, ListChecks, Trophy } from "lucide-react";

type UserAnalyticsBrowserProps = {
  cards: DailyCard[];
  userBets: UserBet[];
  premiumUser?: boolean;
};

export function UserAnalyticsBrowser({ cards, userBets, premiumUser = false }: UserAnalyticsBrowserProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("30d");
  const [sport, setSport] = useState("All sports");
  const [range, setRange] = useState<DateRangeFilter>({});

  const sports = useMemo(() => ["All sports", ...listSupportedSports(cards, userBets)], [cards, userBets]);
  const snapshot = useMemo(() => buildUserPerformance(userBets, timeframe, sport, range), [userBets, timeframe, sport, range]);
  const sharplinesSnapshot = useMemo(() => buildSharplinesPerformance(cards, timeframe, sport, range), [cards, timeframe, sport, range]);

  return (
    <div className="space-y-6">
      <div className="panel-strong p-6 sm:p-8">
        <p className="muted-label">Analytics</p>
        <h2 className="mt-2 text-4xl uppercase text-white">Your betting analytics, built like a real review tool.</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          Review your record by timeframe, chart your units, and isolate where your tracked bets are working or slipping. Sharplines stays in view so the personal tracker always has context.
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
            premiumUser={premiumUser}
          />
        </div>
        {!premiumUser ? (
          <div className="mt-4 rounded-[20px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/75">
            Free accounts can review core analytics. Premium unlocks custom date ranges, deeper breakdowns by sportsbook and bet type, and the full compare workflow.
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="Tracked bets" value={String(snapshot.totalBets)} icon={ListChecks} />
        <DashboardStatCard label="Win rate" value={`${snapshot.winRate.toFixed(1)}%`} icon={Trophy} />
        <DashboardStatCard label="Units" value={formatUnits(snapshot.units)} icon={BarChart3} />
        <DashboardStatCard label="Wagered" value={formatCurrency(snapshot.totalAmountWagered)} icon={CalendarClock} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <PerformanceTrendChart
          rows={snapshot.byMonth}
          title="Monthly profit / loss"
          copy="Monthly units show whether your process is staying stable across bigger sample windows."
          accent="aqua"
        />
        <CumulativeUnitsChart
          title="Cumulative units"
          copy="Cumulative units strip out some day-to-day noise and make direction easier to judge."
          points={snapshot.cumulativeUnits}
          accent="aqua"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DistributionCard
          title="Win / loss distribution"
          copy="Settled and pending bets stay visible so the tracker does not overstate what has actually closed."
          items={snapshot.winLossDistribution}
        />
        <div className="panel p-6">
          <p className="muted-label">Streaks + context</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Current streak</p>
              <p className="mt-2 text-3xl uppercase text-white">{snapshot.currentStreak.label}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Longest win streak</p>
              <p className="mt-2 text-3xl uppercase text-neon">{snapshot.longestWinStreak}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Longest loss streak</p>
              <p className="mt-2 text-3xl uppercase text-rose-200">{snapshot.longestLossStreak}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Sharplines ROI</p>
              <p className="mt-2 text-3xl uppercase text-white">{sharplinesSnapshot.roi.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <BreakdownBarCard
          rows={snapshot.bySport}
          title="ROI by sport"
          copy="Sport-level ROI makes it easier to see where your process is strongest."
          metric="roi"
        />
        <BreakdownBarCard
          rows={snapshot.bySport}
          title="Units by sport"
          copy="Units by sport help separate volume from true contribution."
          metric="units"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <BreakdownBarCard
          rows={snapshot.bySport}
          title="Win rate by sport"
          copy="Win rate alone is incomplete, but it still helps spotlight which sports are behaving cleanly."
          metric="winRate"
        />
        <BreakdownBarCard
          rows={snapshot.byLeague}
          title="Performance by league"
          copy="League-level review helps tighten your process down to the competitions you track most."
          metric="units"
        />
      </div>

      {premiumUser ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <BreakdownBarCard
            rows={snapshot.bySportsbook}
            title="Performance by sportsbook"
            copy="Book-level tracking helps you see whether your prices or shopping habits are concentrated in one place."
            metric="roi"
          />
          <BreakdownBarCard
            rows={snapshot.byBetType}
            title="Performance by bet type"
            copy="Spread, total, moneyline, and prop results often behave differently over time."
            metric="units"
          />
        </div>
      ) : (
        <PremiumCtaBlock
          compact
          title="Unlock deeper analytics"
          copy="Premium expands your dashboard with custom date ranges, sportsbook-level review, bet-type breakdowns, and a stronger compare workflow."
        />
      )}
    </div>
  );
}
