import Link from "next/link";
import type { Route } from "next";
import { Gem, Lock } from "lucide-react";
import { getSportsbookSlugByName, type PickEntry } from "@/lib/data";
import { formatOdds } from "@/lib/utils";
import { PickLiveSummary } from "@/components/pick-live-summary";

type BestBetBannerProps = {
  pick: PickEntry;
  locked?: boolean;
};

export function BestBetBanner({ pick, locked = false }: BestBetBannerProps) {
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="panel-strong overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">
              <Gem className="h-4 w-4" />
              Best Bet
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/50">
              {pick.sport} • {pick.league}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/50">
              {pick.confidence} confidence
            </span>
          </div>
          <h2 className="mt-5 text-4xl uppercase text-white sm:text-5xl">{pick.pickTitle}</h2>
          <p className="mt-3 text-lg text-mist/75">
            {pick.event} • {pick.line} • {formatOdds(pick.odds)} • {pick.startTime}
          </p>
          <PickLiveSummary pick={pick} />
          <p className="mt-4 text-sm leading-7">{locked ? pick.premiumTeaser : pick.premiumAnalysis}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="muted-label">Card placement</p>
          <p className="mt-2 text-3xl font-display uppercase text-neon">{pick.units.toFixed(1)}u</p>
          <p className="mt-3 text-sm text-mist/65">
            {sportsbookSlug ? (
              <Link href={`/sportsbooks/${sportsbookSlug}` as Route} className="hover:text-white">
                {pick.sportsbook}
              </Link>
            ) : (
              pick.sportsbook
            )}
          </p>
          {locked ? (
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber-100">
              <Lock className="h-4 w-4" />
              Premium analysis locked
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
