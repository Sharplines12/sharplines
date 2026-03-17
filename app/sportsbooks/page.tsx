import type { Metadata } from "next";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PromoOfferCard } from "@/components/promo-offer-card";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { SectionHeading } from "@/components/section-heading";
import { getSportsbooks } from "@/lib/content";
import { siteConfig } from "@/lib/data";
import { SportsbookCard } from "@/components/sportsbook-card";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Sportsbook Reviews`,
  description:
    `Browse sportsbook reviews, neutral operator summaries, and affiliate review pages from ${siteConfig.name}.`
};

export default async function SportsbooksPage() {
  const sportsbooks = await getSportsbooks();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Affiliate Support Pages"
        title="Sportsbook reviews stay neutral, compliant, and secondary to the premium picks product."
        copy="These pages give Sharplines real editorial depth through calm operator coverage, clean review structure, and compliant on-site context."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {sportsbooks.map((sportsbook) => (
          <SportsbookCard key={sportsbook.slug} sportsbook={sportsbook} expanded />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {sportsbooks.slice(0, 2).map((sportsbook) => (
          <PromoOfferCard key={`${sportsbook.slug}-offer`} sportsbook={sportsbook} />
        ))}
      </div>

      <DisclaimerBanner copy="These review pages are editorially framed. Terms, state access, and operator availability vary by operator and location." />
      <ResponsibleGamingBanner />
    </div>
  );
}
