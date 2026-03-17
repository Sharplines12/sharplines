"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, Landmark, PiggyBank, Trophy } from "lucide-react";
import type { CasinoSession } from "@/lib/data";
import type { DateRangeFilter, TimeframeKey } from "@/lib/performance";
import { buildCasinoPerformance } from "@/lib/casino-performance";
import { CasinoFilterBar } from "@/components/casino-filter-bar";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { CasinoTrendChart } from "@/components/casino-trend-chart";
import { CasinoCumulativeChart } from "@/components/casino-cumulative-chart";
import { DistributionCard } from "@/components/distribution-card";
import { CasinoStatBarCard } from "@/components/casino-stat-bar-card";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { cn, formatCurrency } from "@/lib/utils";

type CasinoAnalyticsBrowserProps = {
  sessions: CasinoSession[];
  premiumUser?: boolean;
};

export function CasinoAnalyticsBrowser({ sessions, premiumUser = false }: CasinoAnalyticsBrowserProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("30d");
  const [gameType, setGameType] = useState("All games");
  const [casinoApp, setCasinoApp] = useState("All apps");
  const [range, setRange] = useState<DateRangeFilter>({});

  const gameTypes = useMemo(() => ["All games", ...Array.from(new Set(sessions.map((session) => session.gameType))).sort()], [sessions]);
  const casinoApps = useMemo(() => ["All apps", ...Array.from(new Set(sessions.map((session) => session.casinoName))).sort()], [sessions]);
  const snapshot = useMemo(
    () => buildCasinoPerformance(sessions, timeframe, gameType, premiumUser ? casinoApp : "All apps", range),
    [sessions, timeframe, gameType, premiumUser, casinoApp, range]
  );

  return (
    <div className="space-y-6">
      <div className="panel-strong p-6 sm:p-8">
        <p className="muted-label">Casino analytics</p>
        <h1 className="mt-2 text-4xl uppercase text-white">Session-based analytics for casino play.</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          This analytics layer tracks casino bankroll movement by session, app, and game type so it stays clearly separate from sportsbook ROI, units, and Sharplines pick results.
        </p>
        <div className="mt-6">
          <CasinoFilterBar
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            range={range}
            onRangeChange={setRange}
            gameType={gameType}
            onGameTypeChange={setGameType}
            gameTypes={gameTypes}
            casinoApp={casinoApp}
            onCasinoAppChange={setCasinoApp}
            casinoApps={casinoApps}
            premiumUser={premiumUser}
          />
        </div>
        {!premiumUser ? (
          <div className="mt-4 rounded-[20px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/75">
            Free accounts can see core session metrics. Premium unlocks deeper filters and a wider casino breakdown layer.
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="Sessions" value={String(snapshot.totalSessions)} icon={Landmark} />
        <DashboardStatCard label="Net" value={formatCurrency(snapshot.netProfitLoss)} icon={CircleDollarSign} />
        <DashboardStatCard label="Buy-in" value={formatCurrency(snapshot.totalBuyIn)} icon={PiggyBank} />
        <DashboardStatCard label="Best session" value={formatCurrency(snapshot.bestSession?.profitLoss || 0)} icon={Trophy} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <CasinoTrendChart
          title="Monthly profit / loss"
          copy="Monthly net results keep session-based swings visible without mixing them into sportsbook metrics."
          rows={snapshot.byMonth}
        />
        <CasinoCumulativeChart
          title="Cumulative bankroll trend"
          copy="This cumulative curve shows how casino sessions have moved your bankroll over time."
          points={snapshot.cumulativeNet}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DistributionCard
          title="Session outcome distribution"
          copy="A clean split between winning, losing, and breakeven sessions keeps the casino tracker accountable."
          items={[
            { label: "Winning sessions", value: snapshot.positiveSessions, tone: "neon" },
            { label: "Losing sessions", value: snapshot.negativeSessions, tone: "rose" },
            { label: "Breakeven sessions", value: snapshot.breakevenSessions, tone: "mist" }
          ]}
        />
        <div className="panel p-6">
          <p className="muted-label">Session context</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Average session</p>
              <p className={cn("mt-2 text-3xl uppercase", snapshot.averageSessionResult >= 0 ? "text-neon" : "text-rose-200")}>
                {formatCurrency(snapshot.averageSessionResult)}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Worst session</p>
              <p className="mt-2 text-3xl uppercase text-rose-200">{formatCurrency(snapshot.worstSession?.profitLoss || 0)}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Cash-out total</p>
              <p className="mt-2 text-3xl uppercase text-white">{formatCurrency(snapshot.totalCashOut)}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Session model</p>
              <p className="mt-2 text-lg uppercase text-white">Buy-in / cash-out</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <CasinoStatBarCard
          rows={snapshot.byGameType}
          title="Performance by game type"
          copy="Use this to separate table-game results from slots, baccarat, roulette, or anything else you track."
          metric="net"
        />
        <CasinoStatBarCard
          rows={snapshot.byGameType}
          title="Average session by game type"
          copy="Average session result helps show where volatility or discipline is strongest."
          metric="average"
        />
      </div>

      {premiumUser ? (
        <CasinoStatBarCard
          rows={snapshot.byCasinoApp}
          title="Performance by casino app"
          copy="Premium casino analytics can isolate whether one app or brand is driving most of the session volume and results."
          metric="net"
        />
      ) : (
        <PremiumCtaBlock
          compact
          title="Unlock deeper casino analytics"
          copy="Premium expands your casino tracker with app-level breakdowns, custom date ranges, and stronger filtering while keeping sportsbook and casino products separate."
        />
      )}
    </div>
  );
}
