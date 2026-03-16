import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SectionHeading } from "@/components/section-heading";
import { getArticles } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Articles`,
  description:
    `Read betting analysis, strategy articles, and sportsbook review content from ${siteConfig.name}.`
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Articles"
        title="Editorial content keeps the brand sharp and trust-first."
        copy="These article previews help the site feel like a real media property while supporting long-term SEO growth."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <DisclaimerBanner copy="Article content is educational and editorial. Use it to support trust, SEO growth, and clean internal linking across the site." />
    </div>
  );
}
