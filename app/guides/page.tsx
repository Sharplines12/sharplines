import type { Metadata } from "next";
import Link from "next/link";
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
  const featuredGroups = [
    {
      title: "Sportsbook comparisons",
      copy: "Best apps, operator matchups, and category-specific comparisons built to help readers evaluate books with more than promo headlines.",
      slugs: [
        "best-sportsbook-apps-in-the-us-2026",
        "fanduel-vs-draftkings-full-comparison",
        "best-sportsbook-for-parlays",
        "best-sportsbook-for-live-betting"
      ]
    },
    {
      title: "Betting education",
      copy: "Foundational explainers that walk readers through odds, line reading, sportsbook basics, and how the market actually works.",
      slugs: ["how-sports-betting-works", "what-american-odds-mean", "how-to-read-betting-lines", "how-welcome-bonuses-work"]
    },
    {
      title: "Method and discipline",
      copy: "Long-form content around bankroll structure, transparent tracking, and the Sharplines approach to building a daily card.",
      slugs: ["bankroll-management-guide", "how-sharplines-makes-picks"]
    }
  ];

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Betting Guides"
        title="Long-form guides give Sharplines the depth of a real betting media property."
        copy="This library is built around sportsbook comparisons, betting education, and disciplined methodology. The goal is to support the daily card with evergreen editorial pages that help SEO, improve trust, and keep the brand grounded in analysis rather than hype."
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
        {featuredGroups.map((group) => (
          <div key={group.title} className="panel p-6">
            <p className="muted-label">{group.title}</p>
            <p className="mt-4 text-sm leading-7 text-mist/75">{group.copy}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {group.slugs
                .map((slug) => guides.find((guide) => guide.slug === slug))
                .filter(Boolean)
                .map((guide) => (
                  <Link key={guide!.slug} href={`/guides/${guide!.slug}`} className="cta-secondary">
                    {guide!.title}
                  </Link>
                ))}
            </div>
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
