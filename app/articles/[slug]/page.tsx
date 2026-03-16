import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { getArticleBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/data";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | ${siteConfig.name}`,
    description: article.excerpt
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: siteConfig.name
    }
  };

  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-4xl panel-strong p-8 sm:p-10">
        <p className="muted-label">{article.heroKicker}</p>
        <h1 className="mt-3 text-5xl uppercase text-white">{article.title}</h1>
        <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-mist/45">
          <span>{article.publishedAt}</span>
          <span>{article.readingTime}</span>
        </div>
        <p className="mt-6 text-lg text-mist/75">{article.excerpt}</p>
        <div className="mt-8 space-y-5 text-sm leading-8">
          {article.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/daily-picks" className="cta-secondary">
            See today&apos;s picks
          </Link>
          <Link href="/guides" className="cta-secondary">
            Browse betting guides
          </Link>
        </div>
      </article>
      <div className="mt-8">
        <PremiumCtaBlock
          compact
          title="Strong editorial work earns attention. The daily card is what turns that attention into a product."
          copy="Sharplines uses articles to build trust first, then moves readers into daily picks, premium analysis, and the member dashboard."
        />
      </div>
    </div>
  );
}
