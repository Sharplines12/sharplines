import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { DailyPicksBrowser } from "@/components/daily-picks-browser";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/data";
import { getDailyCards } from "@/lib/content";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Daily Picks`,
  description:
    `Browse today's top picks, featured best bets, and limited free previews from ${siteConfig.name}.`
};

export default async function DailyPicksPage() {
  const dailyCards = await getDailyCards();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Daily Picks"
        title="Daily top picks sit at the center of the whole product."
        copy="Free users can scan the headline plays and preview limited analysis. Upcoming picks stay in the teaser flow, while already-started plays drop into an archive area below so the board keeps its timing honest."
      />

      <DailyPicksBrowser cards={dailyCards} freePreviewCount={siteConfig.freePreviewCount} />

      <div className="panel-strong px-6 py-8 sm:px-10">
        <h2 className="text-4xl uppercase text-white">Unlock the full premium card</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          Premium members get complete analysis, extra locked picks, unit sizing notes, archived cards, and dashboard
          access built around the daily top picks product.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CheckoutButton className="cta-primary">Upgrade to premium</CheckoutButton>
          <Link href="/pricing" className="cta-secondary">
            Compare plans
          </Link>
        </div>
      </div>

      <DisclaimerBanner copy="Lines, player availability, and listed prices can move throughout the day. Always confirm the current number and market status before placing a wager." />
      <ResponsibleGamingBanner />
    </div>
  );
}
