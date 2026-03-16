import type { Metadata } from "next";
import { BestBetBanner } from "@/components/best-bet-banner";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PickRow } from "@/components/pick-row";
import { PremiumBadge } from "@/components/premium-badge";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { requirePaidMember } from "@/lib/auth";
import { getResultsLedger, getTodayCard } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Premium Picks`,
  description:
    `Premium members can access the full daily betting card, deeper analysis, and archived picks inside ${siteConfig.name}.`
};

export default async function PremiumPicksPage() {
  await requirePaidMember();
  const [todayCard, resultsLedger] = await Promise.all([getTodayCard(), getResultsLedger()]);
  const bestBet = todayCard.picks.find((pick) => pick.isBestBet) ?? todayCard.picks[0];

  return (
    <div className="site-container space-y-8 pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Premium picks</p>
        <PremiumBadge className="mt-3" />
        <h1 className="mt-2 text-5xl uppercase text-white">The complete daily card, notes, and premium context.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7">{todayCard.premiumIntro}</p>
      </div>

      <BestBetBanner pick={bestBet} />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          {todayCard.picks.map((pick) => (
            <PickRow key={pick.id} pick={pick} detailed />
          ))}
        </div>
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="muted-label">Premium-only notes</p>
            <h2 className="mt-2 text-3xl uppercase text-white">How the card is structured today</h2>
            <p className="mt-4 text-sm leading-7">
              Members can use this panel for extra card construction notes, threshold reminders, and late-day market
              context that does not belong on the public daily picks page.
            </p>
          </div>
          <div className="panel p-6">
            <p className="muted-label">Archive snapshot</p>
            <h2 className="mt-2 text-3xl uppercase text-white">Recent premium cards</h2>
            <div className="mt-4 space-y-3 text-sm text-mist/70">
              {resultsLedger.slice(0, 3).map((day) => (
                <div key={day.id} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-medium text-white">{day.date}</p>
                  <p className="mt-2">{day.recordLabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DisclaimerBanner copy="Premium analysis reflects opinion-based betting content and should not be interpreted as guaranteed outcomes or universal availability." />
      <ResponsibleGamingBanner />
    </div>
  );
}
