import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Ticket } from "lucide-react";
import type { Sportsbook } from "@/lib/data";

type PromoOfferCardProps = {
  sportsbook: Sportsbook;
};

export function PromoOfferCard({ sportsbook }: PromoOfferCardProps) {
  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="muted-label">Offer summary</p>
          <h3 className="mt-2 text-3xl uppercase text-white">{sportsbook.name}</h3>
        </div>
        <Ticket className="h-5 w-5 text-aqua" />
      </div>
      <p className="mt-4 text-sm font-medium text-white">{sportsbook.featuredOfferText}</p>
      <p className="mt-3 text-sm leading-7">{sportsbook.promoSummary}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-mist/45">{sportsbook.disclaimer}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href={`/sportsbooks/${sportsbook.slug}` as Route} className="cta-secondary">
          Read review
        </Link>
        <Link href={`/go/${sportsbook.slug}` as Route} className="cta-secondary">
          Visit operator
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
