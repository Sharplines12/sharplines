"use client";

import { useMemo, useState } from "react";
import type { UserBet } from "@/lib/data";
import { cn, formatCurrency, formatUnits } from "@/lib/utils";
import { ResultPill } from "@/components/result-pill";
import { AnalyticsFilterBar } from "@/components/analytics-filter-bar";
import type { DateRangeFilter, TimeframeKey } from "@/lib/performance";

type BetHistoryBrowserProps = {
  bets: UserBet[];
  premiumUser?: boolean;
};

const PAGE_SIZE = 18;

function withinRange(date: string, timeframe: TimeframeKey, range?: DateRangeFilter) {
  if (timeframe === "all") {
    return true;
  }

  const value = new Date(`${date}T00:00:00`).getTime();
  const now = new Date();
  const start = new Date(now);

  if (timeframe === "today") {
    start.setHours(0, 0, 0, 0);
    return value >= start.getTime();
  }

  if (timeframe === "7d") {
    start.setDate(now.getDate() - 7);
    return value >= start.getTime();
  }

  if (timeframe === "30d") {
    start.setDate(now.getDate() - 30);
    return value >= start.getTime();
  }

  if (timeframe === "mtd") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return value >= start.getTime();
  }

  if (timeframe === "ytd") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    return value >= start.getTime();
  }

  if (timeframe === "custom") {
    const afterStart = range?.start ? value >= new Date(`${range.start}T00:00:00`).getTime() : true;
    const beforeEnd = range?.end ? value <= new Date(`${range.end}T23:59:59`).getTime() : true;
    return afterStart && beforeEnd;
  }

  return true;
}

export function BetHistoryBrowser({ bets, premiumUser = false }: BetHistoryBrowserProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("30d");
  const [sport, setSport] = useState("All sports");
  const [result, setResult] = useState("All results");
  const [sportsbook, setSportsbook] = useState("All books");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest first");
  const [range, setRange] = useState<DateRangeFilter>({});
  const [page, setPage] = useState(1);

  const sports = useMemo(() => ["All sports", ...Array.from(new Set(bets.map((bet) => bet.sport))).sort()], [bets]);
  const sportsbooks = useMemo(() => ["All books", ...Array.from(new Set(bets.map((bet) => bet.sportsbook))).sort()], [bets]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return bets
      .filter((bet) => withinRange(bet.date, timeframe, range))
      .filter((bet) => (sport === "All sports" ? true : bet.sport === sport))
      .filter((bet) => (result === "All results" ? true : bet.result === result))
      .filter((bet) => (!premiumUser || sportsbook === "All books" ? true : bet.sportsbook === sportsbook))
      .filter((bet) =>
        lowered ? [bet.event, bet.pickTitle, bet.league, bet.sportsbook].join(" ").toLowerCase().includes(lowered) : true
      )
      .sort((left, right) => {
        if (sort === "Oldest first") {
          return new Date(left.date).getTime() - new Date(right.date).getTime();
        }

        if (sort === "Biggest win") {
          return right.profitLoss - left.profitLoss;
        }

        if (sort === "Biggest loss") {
          return left.profitLoss - right.profitLoss;
        }

        return new Date(right.date).getTime() - new Date(left.date).getTime();
      });
  }, [bets, premiumUser, query, range, result, sort, sport, sportsbook, timeframe]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="panel-strong p-6 sm:p-8">
        <p className="muted-label">Bet history</p>
        <h2 className="mt-2 text-4xl uppercase text-white">Your complete bet history, filtered the right way.</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          Search every tracked position by game, sport, result, and timeframe. Premium unlocks sportsbook-level filtering and custom date windows for deeper review.
        </p>
        <div className="mt-6 space-y-4">
          <AnalyticsFilterBar
            timeframe={timeframe}
            onTimeframeChange={(value) => {
              setTimeframe(value);
              setPage(1);
            }}
            sport={sport}
            onSportChange={(value) => {
              setSport(value);
              setPage(1);
            }}
            sports={sports}
            range={range}
            onRangeChange={(next) => {
              setRange(next);
              setPage(1);
            }}
            premiumUser={premiumUser}
          >
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Search</label>
              <input
                className="glass-input"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Game, team, pick"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Result</label>
              <select className="glass-input" value={result} onChange={(event) => setResult(event.target.value)}>
                {["All results", "pending", "win", "loss", "push"].map((option) => (
                  <option key={option} value={option} className="bg-ink text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sort</label>
              <select className="glass-input" value={sort} onChange={(event) => setSort(event.target.value)}>
                {["Newest first", "Oldest first", "Biggest win", "Biggest loss"].map((option) => (
                  <option key={option} value={option} className="bg-ink text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {premiumUser ? (
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sportsbook</label>
                <select className="glass-input" value={sportsbook} onChange={(event) => setSportsbook(event.target.value)}>
                  {sportsbooks.map((option) => (
                    <option key={option} value={option} className="bg-ink text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </AnalyticsFilterBar>
          {!premiumUser ? (
            <div className="rounded-[20px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/75">
              Premium unlocks custom date ranges and sportsbook-level history filters.
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-white/10 xl:block">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-mist/45">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Sport</th>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Pick</th>
              <th className="px-4 py-3">Sportsbook</th>
              <th className="px-4 py-3">Odds</th>
              <th className="px-4 py-3">Stake</th>
              <th className="px-4 py-3">Units</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">P/L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.02]">
            {pageItems.map((bet) => (
              <tr key={bet.id}>
                <td className="px-4 py-4 text-mist/70">{bet.date}</td>
                <td className="px-4 py-4">
                  <p className="text-white">{bet.sport}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist/45">{bet.league}</p>
                </td>
                <td className="px-4 py-4 text-mist/75">{bet.event}</td>
                <td className="px-4 py-4">
                  <p className="text-white">{bet.pickTitle}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist/45">{bet.betType}</p>
                </td>
                <td className="px-4 py-4 text-mist/75">{bet.sportsbook}</td>
                <td className="px-4 py-4 text-white">{bet.odds}</td>
                <td className="px-4 py-4 text-mist/75">{formatCurrency(bet.stake)}</td>
                <td className="px-4 py-4 text-mist/75">{bet.units.toFixed(1)}u</td>
                <td className="px-4 py-4"><ResultPill result={bet.result} /></td>
                <td className={cn("px-4 py-4", bet.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>{formatUnits(bet.profitLoss)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {pageItems.map((bet) => (
          <article key={bet.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="muted-label">{bet.date} • {bet.sport} • {bet.league}</p>
                <h3 className="mt-2 text-2xl uppercase text-white">{bet.pickTitle}</h3>
              </div>
              <ResultPill result={bet.result} />
            </div>
            <p className="mt-3 text-sm text-white">{bet.event}</p>
            <p className="mt-2 text-sm leading-7 text-mist/70">
              {bet.betType} • {bet.odds} • {bet.sportsbook}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Stake</p>
                <p className="mt-2 text-sm text-white">{formatCurrency(bet.stake)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Units</p>
                <p className="mt-2 text-sm text-white">{bet.units.toFixed(1)}u</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">P/L</p>
                <p className={cn("mt-2 text-sm", bet.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>{formatUnits(bet.profitLoss)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-mist/60">
          Showing {pageItems.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} tracked bets
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="cta-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="cta-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
