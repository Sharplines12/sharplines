import Link from "next/link";
import type { Route } from "next";
import type { Article } from "@/lib/data";

type ArticleCardProps = {
  article: Article;
  hrefPrefix?: "/articles" | "/guides";
};

export function ArticleCard({ article, hrefPrefix = "/articles" }: ArticleCardProps) {
  return (
    <article className="surface p-6">
      <p className="muted-label">{article.category}</p>
      <h3 className="mt-3 text-3xl uppercase text-slate-950">{article.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{article.excerpt}</p>
      <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
        <span>{article.publishedAt}</span>
        <span>{article.readingTime}</span>
      </div>
      <Link href={`${hrefPrefix}/${article.slug}` as Route} className="cta-secondary mt-5">
        Read article
      </Link>
    </article>
  );
}
