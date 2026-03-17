import Link from "next/link";
import type { Route } from "next";
import { Gem, Lock } from "lucide-react";
import { getSportsbookSlugByName, type PickEntry } from "@/lib/data";
import { formatOdds } from "@/lib/utils";

type BestBetBannerProps = {
  pick: PickEntry;
  locked?: boolean;
};

export function BestBetBanner({ pick, locked = false }: BestBetBannerProps) {
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="surface-strong overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">
              <Gem className="h-4 w-4" />
              Best Bet
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {pick.sport} • {pick.league}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {pick.confidence} confidence
            </span>
          </div>
          <h2 className="mt-5 text-4xl uppercase text-slate-950 sm:text-5xl">{pick.pickTitle}</h2>
          <p className="mt-3 text-lg text-slate-600">
            {pick.event} • {pick.line} • {formatOdds(pick.odds)} • {pick.startTime}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">{locked ? pick.premiumTeaser : pick.premiumAnalysis}</p>
        </div>
        <div className="surface-soft p-5">
          <p className="muted-label">Card placement</p>
          <p className="mt-2 text-3xl font-display uppercase text-lime-700">{pick.units.toFixed(1)}u</p>
          <p className="mt-3 text-sm text-slate-600">
            {sportsbookSlug ? (
              <Link href={`/sportsbooks/${sportsbookSlug}` as Route} className="hover:text-slate-950">
                {pick.sportsbook}
              </Link>
            ) : (
              pick.sportsbook
            )}
          </p>
          {locked ? (
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber-700">
              <Lock className="h-4 w-4" />
              Premium analysis locked
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
