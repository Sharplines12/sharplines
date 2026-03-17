"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PickArchiveEntry } from "@/lib/picks";
import { formatPickTimestamp } from "@/lib/picks";
import { cn, formatUnits } from "@/lib/utils";
import { LiveStatusPill } from "@/components/live-status-pill";
import { ResultPill } from "@/components/result-pill";

type ArchiveBrowserProps = {
  picks: PickArchiveEntry[];
  title?: string;
  copy?: string;
};

const PAGE_SIZE = 16;

export function ArchiveBrowser({ picks, title = "Public picks archive", copy }: ArchiveBrowserProps) {
  const [sport, setSport] = useState("All sports");
  const [league, setLeague] = useState("All leagues");
  const [result, setResult] = useState("All results");
  const [sort, setSort] = useState("Newest first");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const sports = useMemo(() => ["All sports", ...Array.from(new Set(picks.map((pick) => pick.sport))).sort()], [picks]);
  const leagues = useMemo(
    () => ["All leagues", ...Array.from(new Set(picks.filter((pick) => sport === "All sports" || pick.sport === sport).map((pick) => pick.league))).sort()],
    [picks, sport]
  );

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    const next = picks
      .filter((pick) => (sport === "All sports" ? true : pick.sport === sport))
      .filter((pick) => (league === "All leagues" ? true : pick.league === league))
      .filter((pick) => (result === "All results" ? true : pick.result === result))
      .filter((pick) =>
        lowered
          ? [pick.event, pick.pickTitle, pick.line, pick.sportsbook].join(" ").toLowerCase().includes(lowered)
          : true
      )
      .sort((left, right) => {
        if (sort === "Oldest first") {
          return new Date(left.postedAt).getTime() - new Date(right.postedAt).getTime();
        }

        return new Date(right.postedAt).getTime() - new Date(left.postedAt).getTime();
      });

    return next;
  }, [league, picks, query, result, sort, sport]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="panel-strong p-6 sm:p-8">
        <p className="muted-label">Archive</p>
        <h2 className="mt-2 text-4xl uppercase text-white">{title}</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          {copy ||
            "Every historical Sharplines pick stays visible with the original odds snapshot, result, units, and posted timestamp. Future picks stay premium, but the past stays public."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Search</label>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Game, team, book"
              className="glass-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sport</label>
            <select
              className="glass-input"
              value={sport}
              onChange={(event) => {
                setSport(event.target.value);
                setLeague("All leagues");
                setPage(1);
              }}
            >
              {sports.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">League</label>
            <select
              className="glass-input"
              value={league}
              onChange={(event) => {
                setLeague(event.target.value);
                setPage(1);
              }}
            >
              {leagues.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Result</label>
            <select
              className="glass-input"
              value={result}
              onChange={(event) => {
                setResult(event.target.value);
                setPage(1);
              }}
            >
              {["All results", "win", "loss", "push", "pending"].map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sort</label>
            <select className="glass-input" value={sort} onChange={(event) => setSort(event.target.value)}>
              {["Newest first", "Oldest first"].map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-white/10 xl:block">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-mist/45">
            <tr>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Sport</th>
              <th className="px-4 py-3">Odds at posting</th>
              <th className="px-4 py-3">Game state</th>
              <th className="px-4 py-3">Units</th>
              <th className="px-4 py-3">P/L</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.02]">
            {pageItems.map((pick) => (
              <tr key={pick.id}>
                <td className="px-4 py-4 align-top text-mist/65">
                  <p>{formatPickTimestamp(pick.postedAt)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mist/40">{pick.sportsbook}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <Link href={`/picks/${pick.slug}`} className="font-medium text-white hover:text-aqua">
                    {pick.event}
                  </Link>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mist/45">{pick.league}</p>
                </td>
                <td className="px-4 py-4 align-top text-mist/75">
                  <p className="text-white">{pick.pickTitle}</p>
                  <p className="mt-1">{pick.line}</p>
                </td>
                <td className="px-4 py-4 align-top text-mist/65">
                  <p>{pick.sport}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mist/40">{pick.confidence} confidence</p>
                </td>
                <td className="px-4 py-4 align-top text-white">{pick.odds}</td>
                <td className="px-4 py-4 align-top text-mist/75">
                  {pick.liveStatus ? <LiveStatusPill status={pick.liveStatus} /> : null}
                  <p className="mt-2 text-white">{pick.scoreboard?.summary || "No score feed"}</p>
                </td>
                <td className="px-4 py-4 align-top text-mist/75">{pick.units.toFixed(1)}u</td>
                <td className={cn("px-4 py-4 align-top", pick.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                  {formatUnits(pick.profitLoss)}
                </td>
                <td className="px-4 py-4 align-top">
                  <ResultPill result={pick.result} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {pageItems.map((pick) => (
          <article key={pick.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="muted-label">{pick.sport} • {pick.league}</p>
                <Link href={`/picks/${pick.slug}`} className="mt-2 block text-2xl uppercase text-white hover:text-aqua">
                  {pick.pickTitle}
                </Link>
              </div>
              <ResultPill result={pick.result} />
            </div>
            <p className="mt-4 text-sm text-white">{pick.event}</p>
            <p className="mt-2 text-sm leading-7 text-mist/70">
              {pick.line} • {pick.odds} • {pick.units.toFixed(1)}u • {pick.sportsbook}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Posted at</p>
                <p className="mt-2 text-sm text-white">{formatPickTimestamp(pick.postedAt)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">Game state</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {pick.liveStatus ? <LiveStatusPill status={pick.liveStatus} /> : null}
                  <span className="text-sm text-white">{pick.scoreboard?.summary || "No score feed"}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Profit / loss</p>
              <p className={cn("mt-2 text-sm", pick.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                {formatUnits(pick.profitLoss)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-mist/60">
          Showing {pageItems.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} archived picks
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
