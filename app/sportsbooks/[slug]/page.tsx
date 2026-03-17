import Link from "next/link";
import type { Route } from "next";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/author-card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PromoOfferCard } from "@/components/promo-offer-card";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { getSportsbookBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/data";

type SportsbookReviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: SportsbookReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sportsbook = await getSportsbookBySlug(slug);

  if (!sportsbook) {
    return {};
  }

  return {
    title: `${sportsbook.name} Review | ${siteConfig.name}`,
    description: sportsbook.summary
  };
}

export default async function SportsbookReviewPage({ params }: SportsbookReviewPageProps) {
  const { slug } = await params;
  const sportsbook = await getSportsbookBySlug(slug);

  if (!sportsbook) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: sportsbook.name
    },
    author: {
      "@type": "Person",
      name: siteConfig.founder.name
    },
    reviewBody: sportsbook.summary
  };

  return (
    <div className="site-container space-y-8 pb-16 pt-10 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="panel-strong p-8">
        <p className="muted-label">Sportsbook review</p>
        <h1 className="mt-2 text-5xl uppercase text-white">{sportsbook.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          {sportsbook.overview} Sharplines reviews operators through a data-driven approach, comparison-minded
          editorial coverage, and disciplined betting context rather than hype-led promo copy.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">Overview</h2>
            <p className="mt-4 text-sm leading-7">
              {sportsbook.summary} The goal is to explain where the book fits, how it compares, and whether it
              supports a disciplined betting workflow over the long term.
            </p>
          </div>
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">User experience</h2>
            <p className="mt-4 text-sm leading-7">{sportsbook.userExperience}</p>
          </div>
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">Markets offered</h2>
            <p className="mt-4 text-sm leading-7">{sportsbook.marketsOffered}</p>
          </div>
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">Payment methods</h2>
            <p className="mt-4 text-sm leading-7">{sportsbook.paymentMethods}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">Pros</h2>
            <ul className="mt-4 space-y-3 text-sm text-mist/75">
              {sportsbook.pros.map((item) => (
                <li key={item} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">Cons</h2>
            <ul className="mt-4 space-y-3 text-sm text-mist/75">
              {sportsbook.cons.map((item) => (
                <li key={item} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h2 className="text-3xl uppercase text-white">Who it&apos;s best for</h2>
            <p className="mt-4 text-sm leading-7">{sportsbook.bestFor}</p>
            <h3 className="mt-6 text-xl uppercase text-white">Promo summary</h3>
            <p className="mt-3 text-sm leading-7">{sportsbook.promoSummary}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-mist/45">{sportsbook.disclaimer}</p>
            <Link href={`/go/${sportsbook.slug}` as Route} className="cta-primary mt-5">
              Visit official site
            </Link>
          </div>
        </div>
      </div>

      <AuthorCard
        title="Written by Dale Campbell"
        links={[
          { label: "More sportsbook reviews", href: "/sportsbooks" },
          { label: "Responsible Gaming", href: "/responsible-gaming" }
        ]}
      />
      <PromoOfferCard sportsbook={sportsbook} />
      <DisclaimerBanner copy="Operator offers, odds, and state eligibility change often. Always confirm current terms before publishing live recommendations or review summaries." />
      <ResponsibleGamingBanner />
    </div>
  );
}
