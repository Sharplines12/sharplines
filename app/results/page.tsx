import type { Metadata } from "next";
import { RecordTracker } from "@/components/record-tracker";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { ResultsDayCard } from "@/components/results-day-card";
import { ResultsTable } from "@/components/results-table";
import { SectionHeading } from "@/components/section-heading";
import { getDailyCards, getResultsLedger } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Record Tracker & Results`,
  description:
    `View the public results ledger, record tracker, and recent graded picks for ${siteConfig.name}.`
};

export default async function ResultsPage() {
  const [resultsLedger, dailyCards] = await Promise.all([getResultsLedger(), getDailyCards()]);

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Results"
        title="Transparent tracking is what keeps the premium brand trustworthy."
        copy="The public side shows enough record detail to build trust, while the premium dashboard gives members the cleaner internal view."
      />

      <RecordTracker cards={dailyCards} />

      <div className="space-y-6">
        <h2 className="text-3xl uppercase text-white">Recent results table</h2>
        <ResultsTable cards={resultsLedger} />
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl uppercase text-white">Recent graded cards</h2>
        {resultsLedger.map((day) => (
          <ResultsDayCard key={day.id} day={day} />
        ))}
      </div>

      <ResponsibleGamingBanner />
    </div>
  );
}
