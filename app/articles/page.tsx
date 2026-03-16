import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SectionHeading } from "@/components/section-heading";
import { getArticles } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Articles`,
  description:
    `Read sharper betting analysis, strategy writing, and editorial sportsbook coverage from ${siteConfig.name}.`
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Articles"
        title="The articles should read like a point of view, not filler built to hold a page together."
        copy="Sharplines articles are meant to make the brand feel informed, calm, and worth returning to. They should sound like someone who follows the market closely, not like copy assembled to check an SEO box."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <DisclaimerBanner copy="Article content is editorial and educational. It should deepen trust in the brand, support long-term search growth, and route readers naturally into picks, guides, and premium membership." />
    </div>
  );
}
