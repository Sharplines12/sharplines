import Link from "next/link";
import type { Route } from "next";
import type { Article } from "@/lib/data";

type ArticleCardProps = {
  article: Article;
  hrefPrefix?: "/articles" | "/guides";
};

export function ArticleCard({ article, hrefPrefix = "/articles" }: ArticleCardProps) {
  const ctaLabel = hrefPrefix === "/guides" ? "Read guide" : "Read article";

  return (
    <article className="panel p-6">
      <p className="muted-label">{article.category}</p>
      <h3 className="mt-3 text-3xl uppercase text-white">{article.title}</h3>
      <p className="mt-3 text-sm leading-7">{article.excerpt}</p>
      <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-mist/45">
        <span>{article.publishedAt}</span>
        <span>{article.readingTime}</span>
      </div>
      <Link href={`${hrefPrefix}/${article.slug}` as Route} className="cta-secondary mt-5">
        {ctaLabel}
      </Link>
    </article>
  );
}
