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
        title="Articles give the brand a point of view, not just filler around the picks."
        copy="Sharplines articles are built to feel informed, calm, and worth returning to. They add matchup context, market reads, operator comparisons, and editorial depth around the premium product."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Analysis blog coverage",
            copy:
              "Matchup writeups, market reactions, and betting-angle pieces help the site feel current and engaged with the daily betting cycle."
          },
          {
            title: "Operator comparison content",
            copy:
              "Articles can compare app experience, market breadth, pricing, and user fit so the affiliate side feels editorial instead of salesy."
          },
          {
            title: "Trust-building editorial depth",
            copy:
              "A real article layer shows affiliate managers that Sharplines is building a long-term media footprint rather than a thin landing page."
          }
        ].map((item) => (
          <div key={item.title} className="panel p-6">
            <p className="muted-label">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-mist/75">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <DisclaimerBanner copy="Article content is editorial and educational. It deepens trust in the brand, supports long-term search growth, and routes readers naturally into picks, guides, and premium membership." />
    </div>
  );
}
