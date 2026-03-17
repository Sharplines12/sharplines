import Link from "next/link";
import type { Route } from "next";
import { Lock, TrendingDown, TrendingUp } from "lucide-react";
import { getSportsbookSlugByName, type PickEntry } from "@/lib/data";
import { cn, formatOdds } from "@/lib/utils";

type PickRowProps = {
  pick: PickEntry;
  detailed?: boolean;
};

const resultStyles = {
  win: "border-lime-300 bg-lime-100 text-lime-800",
  loss: "border-rose-200 bg-rose-50 text-rose-700",
  push: "border-sky-200 bg-sky-50 text-sky-700",
  pending: "border-slate-200 bg-slate-50 text-slate-500"
};

export function PickRow({ pick, detailed = false }: PickRowProps) {
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {pick.sport}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {pick.league}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {pick.confidence} confidence
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
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
            <h3 className="text-2xl uppercase text-slate-950">{pick.pickTitle}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {pick.event} • {pick.betType} • {pick.line} at {formatOdds(pick.odds)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
              {sportsbookSlug ? (
                <Link href={`/sportsbooks/${sportsbookSlug}` as Route} className="hover:text-slate-950">
                  {pick.sportsbook}
                </Link>
              ) : (
                pick.sportsbook
              )}{" "}
              • {pick.startTime}
            </p>
          </div>
          <p className="text-sm leading-7 text-slate-600">{detailed ? pick.premiumAnalysis : pick.shortSummary}</p>
        </div>
        <div className="flex items-center gap-3">
          {detailed ? (
            <span className="rounded-full border border-lime-300 bg-lime-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime-800">
              Full member note
            </span>
          ) : (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Premium teaser
            </span>
          )}
          {pick.result === "win" ? (
            <TrendingUp className="h-5 w-5 text-lime-700" />
          ) : pick.result === "loss" ? (
            <TrendingDown className="h-5 w-5 text-rose-500" />
          ) : pick.result === "pending" ? (
            <Lock className="h-5 w-5 text-sky-600" />
          ) : null}
        </div>
      </div>
      {!detailed ? <p className="mt-4 text-sm text-slate-500">{pick.premiumTeaser}</p> : null}
    </div>
  );
}
