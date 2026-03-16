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
        copy="These guides help the site look like a real editorial platform with long-term SEO potential, while still supporting the premium picks product."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {guides.map((guide) => (
          <ArticleCard key={guide.slug} article={guide} hrefPrefix="/guides" />
        ))}
      </div>

      <DisclaimerBanner copy="Guides are educational and informational. Operator availability, terms, and market access vary by state." />
    </div>
  );
}
