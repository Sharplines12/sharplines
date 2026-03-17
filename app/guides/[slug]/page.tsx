import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/author-card";
import { LongformContent } from "@/components/longform-content";
import { PromoOfferCard } from "@/components/promo-offer-card";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { getGuideBySlug, getGuides, getSportsbooks } from "@/lib/content";
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
  const [guide, allGuides, sportsbooks] = await Promise.all([getGuideBySlug(slug), getGuides(), getSportsbooks()]);

  if (!guide) {
    notFound();
  }

  const relatedGuides = allGuides.filter((item) => item.slug !== guide.slug).slice(0, 3);

  const sportsbookGuideMap: Record<string, string[]> = {
    "best-sportsbook-apps-in-the-us-2026": ["fanduel", "draftkings", "betmgm"],
    "fanduel-vs-draftkings-full-comparison": ["fanduel", "draftkings", "betmgm"],
    "best-sportsbook-for-parlays": ["fanduel", "draftkings", "fanatics"],
    "best-sportsbook-for-live-betting": ["fanduel", "betmgm", "caesars"]
  };

  const ctaSportsbooks = (sportsbookGuideMap[guide.slug] || ["fanduel", "draftkings", "betmgm"])
    .map((slugValue) => sportsbooks.find((item) => item.slug === slugValue))
    .filter(Boolean)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    datePublished: guide.publishedAt,
    description: guide.excerpt,
    author: {
      "@type": "Person",
      name: siteConfig.founder.name
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
        <div className="mt-8">
          <AuthorCard
            compact
            links={[
              { label: "Daily Picks", href: "/daily-picks" },
              { label: "Sportsbook Reviews", href: "/sportsbooks" },
              { label: "More guides", href: "/guides" }
            ]}
          />
        </div>
        <LongformContent content={guide.content} />
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/daily-picks" className="cta-secondary">
            See today&apos;s picks
          </Link>
          <Link href="/sportsbooks" className="cta-secondary">
            Browse sportsbook reviews
          </Link>
          <Link href="/guides" className="cta-secondary">
            More guides
          </Link>
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="panel p-6">
          <p className="muted-label">Related guides</p>
          <h2 className="mt-3 text-3xl uppercase text-white">Keep building the foundation.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Sharplines guides are meant to work together. Use related explainers, sportsbook reviews, and the daily
            card to turn educational content into a more complete betting workflow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedGuides.map((item) => (
              <Link key={item.slug} href={`/guides/${item.slug}`} className="cta-secondary">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="muted-label">Responsible note</p>
          <h2 className="mt-3 text-3xl uppercase text-white">Sports betting involves risk.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            No outcome is guaranteed. Only wager what you can afford to lose, and use these guides as educational
            support for an analysis-based approach rather than a promise of results.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/responsible-gaming" className="cta-secondary">
              Responsible Gaming
            </Link>
            <Link href="/results" className="cta-secondary">
              Results Tracking
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {ctaSportsbooks.map((sportsbook) => (
          <PromoOfferCard key={sportsbook!.slug} sportsbook={sportsbook!} />
        ))}
      </div>

      <DisclaimerBanner copy="Guide content is educational and editorial. Sportsbook pricing, terms, and availability vary by state and operator." />

      <PremiumCtaBlock
        compact
        title="Use the guides to build trust, then let the premium card do the monetization."
        copy="This keeps the site feeling like a serious betting media property instead of a thin paywall page."
      />
    </div>
  );
}
