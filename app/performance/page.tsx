import type { Metadata } from "next";
import Link from "next/link";
import { PerformanceBrowser } from "@/components/performance-browser";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { SectionHeading } from "@/components/section-heading";
import { getDailyCards } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Performance`,
  description: `Review Sharplines performance metrics, ROI, units, record breakdowns, and transparent historical results.`
};

export default async function PerformancePage() {
  const cards = await getDailyCards();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Performance"
        title="Transparent performance is a public product layer, not a hidden sales claim."
        copy="Sharplines keeps historical record, units, ROI, and sport-level breakdowns visible so the brand can be evaluated on a full sequence, not on a few screenshots or short-term hot stretches."
      />

      <PerformanceBrowser cards={cards} />

      <div className="panel p-6">
        <p className="muted-label">Explore the record</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/archive" className="cta-secondary">
            Full archive
          </Link>
          <Link href="/results" className="cta-secondary">
            Recent results
          </Link>
          <Link href="/daily-picks" className="cta-secondary">
            Today&apos;s picks
          </Link>
          <Link href="/responsible-gaming" className="cta-secondary">
            Responsible Gaming
          </Link>
        </div>
      </div>

      <ResponsibleGamingBanner />
      <PremiumCtaBlock
        compact
        title="The trust layer stays public. The live edge stays premium."
        copy="Members unlock the current-day card before games start, but the public performance page stays open so Sharplines can be judged over the long run."
      />
    </div>
  );
}
