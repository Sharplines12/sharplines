import Link from "next/link";
import type { Route } from "next";
import { Lock, TrendingDown, TrendingUp } from "lucide-react";
import { getSportsbookSlugByName, type PickEntry } from "@/lib/data";
import { cn, formatOdds } from "@/lib/utils";
import { PickLiveSummary } from "@/components/pick-live-summary";

type PickRowProps = {
  pick: PickEntry;
  detailed?: boolean;
};

const resultStyles = {
  win: "border-neon/30 bg-neon/10 text-neon",
  loss: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  push: "border-aqua/30 bg-aqua/10 text-aqua",
  pending: "border-white/10 bg-white/[0.03] text-mist/70"
};

export function PickRow({ pick, detailed = false }: PickRowProps) {
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/55">
              {pick.sport}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/55">
              {pick.league}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/55">
              {pick.confidence} confidence
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/55">
              {pick.units.toFixed(1)}u
            </span>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                resultStyles[pick.result]
              )}
            >
              {pick.result}
            </span>
          </div>
          <div>
            <h3 className="text-2xl uppercase text-white">{pick.pickTitle}</h3>
            <p className="mt-1 text-sm text-mist/65">
              {pick.event} • {pick.betType} • {pick.line} at {formatOdds(pick.odds)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist/45">
              {sportsbookSlug ? (
                <Link href={`/sportsbooks/${sportsbookSlug}` as Route} className="hover:text-white">
                  {pick.sportsbook}
                </Link>
              ) : (
                pick.sportsbook
              )}{" "}
              • {pick.startTime}
            </p>
            <PickLiveSummary pick={pick} compact />
          </div>
          <p className="text-sm leading-7">{detailed ? pick.premiumAnalysis : pick.shortSummary}</p>
        </div>
        <div className="flex items-center gap-3">
          {detailed ? (
            <span className="rounded-full border border-neon/20 bg-neon/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
              Full member note
            </span>
          ) : (
            <span className="rounded-full border border-ember/20 bg-ember/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              Premium teaser
            </span>
          )}
          {pick.result === "win" ? (
            <TrendingUp className="h-5 w-5 text-neon" />
          ) : pick.result === "loss" ? (
            <TrendingDown className="h-5 w-5 text-rose-200" />
          ) : pick.result === "pending" ? (
            <Lock className="h-5 w-5 text-aqua" />
          ) : null}
        </div>
      </div>
      {!detailed ? <p className="mt-4 text-sm text-mist/60">{pick.premiumTeaser}</p> : null}
    </div>
  );
}
