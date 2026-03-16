import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { getGuideBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/data";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: `${guide.title} | ${siteConfig.name}`,
    description: guide.excerpt
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    datePublished: guide.publishedAt,
    description: guide.excerpt,
    author: {
      "@type": "Organization",
      name: siteConfig.name
    }
  };

  return (
    <div className="site-container space-y-8 pb-16 pt-10 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-4xl panel-strong p-8 sm:p-10">
        <p className="muted-label">{guide.heroKicker}</p>
        <h1 className="mt-3 text-5xl uppercase text-white">{guide.title}</h1>
        <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-mist/45">
          <span>{guide.publishedAt}</span>
          <span>{guide.readingTime}</span>
        </div>
        <p className="mt-6 text-lg text-mist/75">{guide.excerpt}</p>
        <div className="mt-8 space-y-5 text-sm leading-8">
          {guide.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/daily-picks" className="cta-secondary">
            See today&apos;s picks
          </Link>
          <Link href="/sportsbooks" className="cta-secondary">
            Browse sportsbook reviews
          </Link>
        </div>
      </article>

      <PremiumCtaBlock
        compact
        title="Use the guides to build trust, then let the premium card do the monetization."
        copy="This keeps the site feeling like a serious betting media property instead of a thin paywall page."
      />
    </div>
  );
}
