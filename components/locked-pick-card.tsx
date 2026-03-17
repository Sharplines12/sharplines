import Link from "next/link";
import type { Route } from "next";
import { Crown, Lock } from "lucide-react";
import { getSportsbookSlugByName, type PickEntry } from "@/lib/data";
import { formatOdds } from "@/lib/utils";
import { PickLiveSummary } from "@/components/pick-live-summary";

type LockedPickCardProps = {
  pick: PickEntry;
};

export function LockedPickCard({ pick }: LockedPickCardProps) {
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-neon/25 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
            Premium pick
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/50">
            {pick.sport}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/50">
            {pick.confidence} confidence
          </span>
        </div>
        <h3 className="mt-4 text-2xl uppercase text-white">{pick.pickTitle}</h3>
        <p className="mt-2 text-sm text-mist/65">
          {pick.event} • {pick.line} • {formatOdds(pick.odds)} • {pick.startTime}
        </p>
        <PickLiveSummary pick={pick} compact />
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-mist/45">
          {sportsbookSlug ? (
            <Link href={`/sportsbooks/${sportsbookSlug}` as Route} className="hover:text-white">
              {pick.sportsbook}
            </Link>
          ) : (
            pick.sportsbook
          )}
        </p>
        <div className="mt-5 rounded-[24px] border border-white/10 bg-black/30 p-4 backdrop-blur">
          <p className="text-sm leading-7 text-mist/55 blur-[3px]">
            {pick.premiumAnalysis}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber-100">
            <Lock className="h-4 w-4" />
            Unlock full analysis
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neon">
            <Crown className="h-4 w-4" />
            Premium
          </div>
        </div>
      </div>
    </div>
  );
}
