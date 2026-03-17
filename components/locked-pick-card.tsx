import Link from "next/link";
import type { Route } from "next";
import { Crown, Lock } from "lucide-react";
import { getSportsbookSlugByName, type PickEntry } from "@/lib/data";
import { formatOdds } from "@/lib/utils";

type LockedPickCardProps = {
  pick: PickEntry;
};

export function LockedPickCard({ pick }: LockedPickCardProps) {
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="surface relative overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lime-100/50 via-transparent to-transparent" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-lime-300 bg-lime-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-800">
            Premium pick
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            {pick.sport}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            {pick.confidence} confidence
          </span>
        </div>
        <h3 className="mt-4 text-2xl uppercase text-slate-950">{pick.pickTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {pick.event} • {pick.line} • {formatOdds(pick.odds)} • {pick.startTime}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
          {sportsbookSlug ? (
            <Link href={`/sportsbooks/${sportsbookSlug}` as Route} className="hover:text-slate-950">
              {pick.sportsbook}
            </Link>
          ) : (
            pick.sportsbook
          )}
        </p>
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 backdrop-blur">
          <p className="text-sm leading-7 text-slate-400 blur-[3px]">
            {pick.premiumAnalysis}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber-700">
            <Lock className="h-4 w-4" />
            Unlock full analysis
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-lime-800">
            <Crown className="h-4 w-4" />
            Premium
          </div>
        </div>
      </div>
    </div>
  );
}
