import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveBrowser } from "@/components/archive-browser";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { SectionHeading } from "@/components/section-heading";
import { getArchivePicks } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Picks Archive`,
  description: `Browse the full public Sharplines archive with posted odds, timestamps, results, and transparent pick history.`
};

export default async function ArchivePage() {
  const picks = await getArchivePicks();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Picks Archive"
        title="The past stays public so the product feels accountable."
        copy="Sharplines gates the future, not the history. Every settled or already-started pick stays visible with date, market, odds at posting, units, sportsbook, and result so the archive works like a real trust page."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Public archive",
            copy: "Past picks remain visible for free users. The archive is meant to reduce selective memory and make the card auditable."
          },
          {
            title: "Odds at posting",
            copy: "Each archived play preserves the posted line and sportsbook snapshot so the record reflects the number Sharplines actually released."
          },
          {
            title: "Detailed pick pages",
            copy: "Every archived pick links into a deeper page where the result, posting time, and analysis context can be reviewed cleanly."
          }
        ].map((item) => (
          <div key={item.title} className="panel p-6">
            <p className="muted-label">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-mist/75">{item.copy}</p>
          </div>
        ))}
      </div>

      <ArchiveBrowser picks={picks} />

      <div className="panel p-6">
        <p className="muted-label">Keep moving</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/performance" className="cta-secondary">
            Sharplines performance
          </Link>
          <Link href="/daily-picks" className="cta-secondary">
            Today&apos;s picks
          </Link>
          <Link href="/sportsbooks" className="cta-secondary">
            Sportsbook reviews
          </Link>
          <Link href="/guides" className="cta-secondary">
            Betting guides
          </Link>
        </div>
      </div>

      <DisclaimerBanner copy="Past picks remain public for transparency. Sports betting involves risk, no outcome is guaranteed, and posted odds may differ from later market numbers." />
      <ResponsibleGamingBanner />
      <PremiumCtaBlock
        compact
        title="Future picks stay premium. The archive stays public."
        copy="That split keeps Sharplines accountable on the back end while preserving a paid edge on the live card before games lock."
      />
    </div>
  );
}
