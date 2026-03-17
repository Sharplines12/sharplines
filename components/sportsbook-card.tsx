import Link from "next/link";
import type { Route } from "next";
import type { Sportsbook } from "@/lib/data";
import { ArrowUpRight, BadgeDollarSign } from "lucide-react";

type SportsbookCardProps = {
  sportsbook: Sportsbook;
  expanded?: boolean;
};

export function SportsbookCard({ sportsbook, expanded = false }: SportsbookCardProps) {
  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="muted-label">Operator coverage</p>
          <h3 className="mt-2 text-3xl uppercase text-white">{sportsbook.name}</h3>
        </div>
        <BadgeDollarSign className="h-5 w-5 text-aqua" />
      </div>
      <p className="mt-4 text-sm font-medium text-white">{sportsbook.featuredOfferText}</p>
      <p className="mt-3 text-sm leading-7">{sportsbook.summary}</p>
      <ul className="mt-5 space-y-2 text-sm text-mist/70">
        {sportsbook.reviewBullets.map((bullet) => (
          <li key={bullet} className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
            {bullet}
          </li>
        ))}
      </ul>
      {expanded ? <p className="mt-5 text-xs uppercase tracking-[0.16em] text-mist/40">{sportsbook.disclaimer}</p> : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href={`/sportsbooks/${sportsbook.slug}` as Route} className="cta-secondary">
          Read full review
        </Link>
        <Link href={`/go/${sportsbook.slug}` as Route} className="cta-secondary">
          Visit official site
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
