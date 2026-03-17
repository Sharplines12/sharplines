import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { ResultPill } from "@/components/result-pill";
import { getPickBySlug } from "@/lib/content";
import { getSession, isPaidAccess } from "@/lib/auth";
import { getSportsbookSlugByName, siteConfig } from "@/lib/data";
import { formatPickTimestamp } from "@/lib/picks";
import { formatUnits } from "@/lib/utils";

type PickPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PickPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pick = await getPickBySlug(slug);

  if (!pick) {
    return {};
  }

  return {
    title: `${pick.pickTitle} | ${siteConfig.name}`,
    description: `${pick.event} • ${pick.line} • ${pick.odds} • ${pick.sport} ${pick.league}`
  };
}

export default async function PickPage({ params }: PickPageProps) {
  const { slug } = await params;
  const [pick, session] = await Promise.all([getPickBySlug(slug), getSession()]);

  if (!pick) {
    notFound();
  }

  const premiumAccess = session ? isPaidAccess(session.role) : false;
  const fullAnalysisUnlocked = pick.hasStarted || pick.result !== "pending" || premiumAccess;
  const sportsbookSlug = getSportsbookSlugByName(pick.sportsbook);

  return (
    <div className="site-container space-y-8 pb-16 pt-10 sm:pt-14">
      <article className="mx-auto max-w-5xl panel-strong p-8 sm:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="muted-label">{pick.sport} • {pick.league}</p>
            <h1 className="mt-3 text-5xl uppercase text-white">{pick.pickTitle}</h1>
            <p className="mt-4 text-lg text-mist/75">{pick.event}</p>
          </div>
          <ResultPill result={pick.result} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Posted at", value: formatPickTimestamp(pick.postedAt) },
            { label: "Odds at posting", value: pick.odds },
            { label: "Units", value: `${pick.units.toFixed(1)}u` },
            { label: "Profit / loss", value: formatUnits(pick.profitLoss), positive: pick.profitLoss >= 0 }
          ].map((item) => (
            <div key={item.label} className="panel p-4">
              <p className="muted-label">{item.label}</p>
              <p className={`mt-2 text-2xl uppercase ${item.positive === true ? "text-neon" : item.positive === false ? "text-rose-200" : "text-white"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Bet type", value: pick.betType },
            { label: "Confidence", value: `${pick.confidence} confidence` },
            { label: "Sportsbook", value: pick.sportsbook },
            { label: "Closing status", value: pick.closingStatus }
          ].map((item) => (
            <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">{item.label}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <p className="muted-label">Summary</p>
          <p className="mt-4 text-sm leading-7 text-mist/75">{pick.shortSummary}</p>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <p className="muted-label">{fullAnalysisUnlocked ? "Analysis" : "Premium analysis"}</p>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            {fullAnalysisUnlocked
              ? pick.premiumAnalysis
              : `${pick.premiumTeaser} Future picks stay premium until the market locks, then the past becomes part of the public record.`}
          </p>
          {!fullAnalysisUnlocked ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing" className="cta-primary">
                Unlock today&apos;s card
              </Link>
              <Link href="/archive" className="cta-secondary">
                Browse public archive
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/archive" className="cta-secondary">
            Back to archive
          </Link>
          <Link href="/performance" className="cta-secondary">
            Performance page
          </Link>
          <Link href={sportsbookSlug ? `/sportsbooks/${sportsbookSlug}` : "/sportsbooks"} className="cta-secondary">
            Sportsbook review
          </Link>
        </div>
      </article>

      <DisclaimerBanner copy="Sharplines preserves posted odds, timestamps, and graded results for transparency. Sports betting involves risk and no outcome is guaranteed." />
    </div>
  );
}
