import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SectionHeading } from "@/components/section-heading";
import { getGuides } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Betting Guides`,
  description: `Browse betting guides, education content, and evergreen explainer pages from ${siteConfig.name}.`
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Betting Guides"
        title="Evergreen guide content gives the brand depth beyond the daily card."
        copy="These guides position Sharplines like a betting education property as much as a picks brand, with evergreen explainers that support search growth, disciplined betting, and long-term trust."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Foundational betting education",
            copy:
              "Odds formats, bankroll basics, line reading, and operator terminology give new readers an on-ramp into the product."
          },
          {
            title: "Comparison-driven decisions",
            copy:
              "Guides can explain why price, market depth, limits, and app usability matter when readers choose where to bet."
          },
          {
            title: "Evergreen search content",
            copy:
              "These pages also give the site a durable SEO layer that keeps bringing in users even when a single daily card has expired."
          }
        ].map((item) => (
          <div key={item.title} className="panel p-6">
            <p className="muted-label">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-mist/75">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {guides.map((guide) => (
          <ArticleCard key={guide.slug} article={guide} hrefPrefix="/guides" />
        ))}
      </div>

      <DisclaimerBanner copy="Guides are educational and informational. Operator availability, terms, and market access vary by state." />
    </div>
  );
}
