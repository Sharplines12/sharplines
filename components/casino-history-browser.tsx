"use client";

import { useMemo, useState } from "react";
import type { CasinoSession } from "@/lib/data";
import type { DateRangeFilter, TimeframeKey } from "@/lib/performance";
import { CasinoFilterBar } from "@/components/casino-filter-bar";
import { cn, formatCurrency } from "@/lib/utils";
import { PremiumCtaBlock } from "@/components/premium-cta-block";

type CasinoHistoryBrowserProps = {
  sessions: CasinoSession[];
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

export function CasinoHistoryBrowser({ sessions, premiumUser = false }: CasinoHistoryBrowserProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("30d");
  const [gameType, setGameType] = useState("All games");
  const [casinoApp, setCasinoApp] = useState("All apps");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest first");
  const [range, setRange] = useState<DateRangeFilter>({});
  const [page, setPage] = useState(1);

  const gameTypes = useMemo(() => ["All games", ...Array.from(new Set(sessions.map((session) => session.gameType))).sort()], [sessions]);
  const casinoApps = useMemo(() => ["All apps", ...Array.from(new Set(sessions.map((session) => session.casinoName))).sort()], [sessions]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return sessions
      .filter((session) => withinRange(session.date, timeframe, range))
      .filter((session) => (gameType === "All games" ? true : session.gameType === gameType))
      .filter((session) => (!premiumUser || casinoApp === "All apps" ? true : session.casinoName === casinoApp))
      .filter((session) =>
        lowered ? [session.casinoName, session.gameType, session.notes, session.sessionLength || ""].join(" ").toLowerCase().includes(lowered) : true
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
  }, [sessions, timeframe, range, gameType, premiumUser, casinoApp, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="panel-strong p-6 sm:p-8">
        <p className="muted-label">Casino history</p>
        <h1 className="mt-2 text-4xl uppercase text-white">Review every casino session without mixing it into bet history.</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          This history view keeps buy-ins, cash-outs, game types, and session notes separate from sportsbook stakes and units so Sharplines can treat them as different products.
        </p>
        <div className="mt-6 space-y-4">
          <CasinoFilterBar
            timeframe={timeframe}
            onTimeframeChange={(value) => {
              setTimeframe(value);
              setPage(1);
            }}
            range={range}
            onRangeChange={(next) => {
              setRange(next);
              setPage(1);
            }}
            gameType={gameType}
            onGameTypeChange={(value) => {
              setGameType(value);
              setPage(1);
            }}
            gameTypes={gameTypes}
            casinoApp={casinoApp}
            onCasinoAppChange={(value) => {
              setCasinoApp(value);
              setPage(1);
            }}
            casinoApps={casinoApps}
            premiumUser={premiumUser}
          >
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Search notes/history</label>
              <input
                className="glass-input"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Casino, game type, notes"
              />
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
          </CasinoFilterBar>
          {!premiumUser ? (
            <div className="rounded-[20px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/75">
              Premium unlocks custom date ranges and casino-app-level history filters. Free accounts can still keep a full basic session log.
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-white/10 xl:block">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-mist/45">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Casino app</th>
              <th className="px-4 py-3">Game type</th>
              <th className="px-4 py-3">Buy-in</th>
              <th className="px-4 py-3">Cash-out</th>
              <th className="px-4 py-3">Net</th>
              <th className="px-4 py-3">Length</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.02]">
            {pageItems.map((session) => (
              <tr key={session.id}>
                <td className="px-4 py-4 text-mist/70">{session.date}</td>
                <td className="px-4 py-4 text-white">{session.casinoName}</td>
                <td className="px-4 py-4 text-mist/75">{session.gameType}</td>
                <td className="px-4 py-4 text-mist/75">{formatCurrency(session.buyIn)}</td>
                <td className="px-4 py-4 text-mist/75">{formatCurrency(session.cashOut)}</td>
                <td className={cn("px-4 py-4", session.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>{formatCurrency(session.profitLoss)}</td>
                <td className="px-4 py-4 text-mist/70">{session.sessionLength || "—"}</td>
                <td className="max-w-[360px] px-4 py-4 text-mist/65">{session.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {pageItems.map((session) => (
          <article key={session.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="muted-label">{session.date} • {session.casinoName}</p>
                <h3 className="mt-2 text-2xl uppercase text-white">{session.gameType}</h3>
              </div>
              <p className={cn("text-sm font-medium uppercase", session.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                {formatCurrency(session.profitLoss)}
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Buy-in</p>
                <p className="mt-2 text-sm text-white">{formatCurrency(session.buyIn)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Cash-out</p>
                <p className="mt-2 text-sm text-white">{formatCurrency(session.cashOut)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Length</p>
                <p className="mt-2 text-sm text-white">{session.sessionLength || "—"}</p>
              </div>
            </div>
            {session.notes ? <p className="mt-4 text-sm leading-7 text-mist/70">{session.notes}</p> : null}
          </article>
        ))}
      </div>

      {!pageItems.length ? (
        <div className="panel p-6 text-sm leading-7 text-mist/65">
          No casino sessions match this filter yet. Add sessions from `/casino` to start building a separate casino history.
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-mist/60">
          Page {page} of {totalPages} • {filtered.length} sessions
        </p>
        <div className="flex gap-3">
          <button type="button" className="cta-secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            Previous
          </button>
          <button
            type="button"
            className="cta-secondary"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {!premiumUser ? (
        <PremiumCtaBlock
          compact
          title="Unlock deeper casino review"
          copy="Premium expands casino tracking with advanced filters, custom date windows, and a richer analytics layer while keeping sportsbook and casino tools clearly separate."
        />
      ) : null}
    </div>
  );
}
