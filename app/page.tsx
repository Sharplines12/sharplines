import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Crown, LockKeyhole, Newspaper, Sparkles } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { BestBetBanner } from "@/components/best-bet-banner";
import { CheckoutButton } from "@/components/checkout-button";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { LockedPickCard } from "@/components/locked-pick-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { PickRow } from "@/components/pick-row";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { RecordTracker } from "@/components/record-tracker";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { SectionHeading } from "@/components/section-heading";
import { SportsbookCard } from "@/components/sportsbook-card";
import { siteConfig } from "@/lib/data";
import { getArticles, getDailyCards, getGuides, getSportsbooks, getTodayCard } from "@/lib/content";
import { splitCardPicks } from "@/lib/pick-timing";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Daily Top Picks`,
  description:
    `${siteConfig.name} is a premium betting picks brand built around daily top picks, limited free previews, locked premium analysis, and transparent record tracking.`
};

export default async function HomePage() {
  const [todayCard, dailyCards, articles, guides, sportsbooks] = await Promise.all([
    getTodayCard(),
    getDailyCards(),
    getArticles(),
    getGuides(),
    getSportsbooks()
  ]);
  const { upcomingPicks, archivedPicks, freeUpcomingPicks, lockedUpcomingPicks, bestUpcomingPick, bestAvailablePick } =
    splitCardPicks(todayCard, "All sports", siteConfig.freePreviewCount);
  const bestBet = bestUpcomingPick ?? bestAvailablePick;

  return (
    <div className="pb-16">
      <section className="site-container pt-10 sm:pt-16">
        <div className="panel-strong relative overflow-hidden px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="hero-orb right-0 top-0 h-40 w-40 bg-aqua/20" />
          <div className="hero-orb bottom-0 left-1/3 h-32 w-32 bg-neon/15" />
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <span className="eyebrow">
                <Sparkles className="h-4 w-4" />
                Premium Daily Picks
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                  Daily top picks with a media-brand feel and a real premium wall.
                </h1>
                <p className="max-w-2xl text-lg text-mist/75 sm:text-xl">
                  {siteConfig.name} is built to feel like a sharp betting media property first: top picks, best bets,
                  premium analysis, articles, reviews, and a gated member card that does not read like a spam funnel.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CheckoutButton className="cta-primary">
                  Unlock premium picks
                </CheckoutButton>
                <Link href="/daily-picks" className="cta-secondary">
                  Browse today&apos;s free preview
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Daily top picks and best bets", href: "/daily-picks" },
                  { label: "Premium card with locked analysis", href: "/pricing" },
                  { label: "Sportsbook reviews and articles", href: "/sportsbooks" }
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href as Route}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-sm text-mist/75 hover:border-aqua/30 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="panel p-6 sm:p-8">
              <p className="muted-label">Premium product focus</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Today&apos;s card drives the whole site.</h2>
              <p className="mt-4 text-sm leading-7">
                Free users get a limited preview. Premium members get the full daily card, deeper writeups, archived
                picks, record tracking, and the protected dashboard.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { label: "Upcoming preview", value: `${freeUpcomingPicks.length} live teaser picks`, href: "/daily-picks" },
                  { label: "Premium locked", value: `${lockedUpcomingPicks.length} more live angles`, href: "/pricing" },
                  { label: "Today&apos;s best bet", value: bestBet?.pickTitle ?? "Archive in review", href: "/daily-picks" }
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href as Route}
                    className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4 hover:border-aqua/30"
                  >
                    <p className="muted-label">{item.label}</p>
                    <p className="mt-2 text-lg font-medium text-white">{item.value}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Today&apos;s Top Picks"
          title="The homepage should sell the daily card before anything else."
          copy="This section puts the best bet first, keeps the still-live teaser picks up top, and pushes already-started plays into a cleaner archive block."
        />
        <div className="mt-8 space-y-6">
          {bestBet ? <BestBetBanner pick={bestBet} locked /> : null}
          {upcomingPicks.length ? (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                {freeUpcomingPicks.map((pick) => (
                  <PickRow key={pick.id} pick={pick} />
                ))}
              </div>
              <div className="space-y-4">
                {lockedUpcomingPicks.map((pick) => (
                  <LockedPickCard key={pick.id} pick={pick} />
                ))}
                <div className="panel p-5">
                  <div className="flex items-center gap-3">
                    <LockKeyhole className="h-5 w-5 text-neon" />
                    <p className="text-sm text-white">
                      Unlock the full premium card for complete analysis, extra leans, and unit sizing notes.
                    </p>
                  </div>
                  <CheckoutButton className="cta-primary mt-5">Join premium</CheckoutButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Archive mode</p>
              <h3 className="mt-3 text-3xl uppercase text-white">The live teaser has rolled forward.</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/70">
                Today&apos;s visible card has already started, so the homepage preview now leans on the archive block
                instead of pretending old starts are still upcoming.
              </p>
            </div>
          )}
          {archivedPicks.length ? (
            <div className="panel p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Archive preview</p>
                  <h3 className="mt-2 text-3xl uppercase text-white">Started or graded plays move down here.</h3>
                </div>
                <Link href="/results" className="text-sm uppercase tracking-[0.18em] text-aqua hover:text-white">
                  See full results
                </Link>
              </div>
              <div className="mt-5 grid gap-4">
                {archivedPicks.slice(0, 2).map((pick) => (
                  <PickRow key={pick.id} pick={pick} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="site-container mt-20">
        <RecordTracker cards={dailyCards} />
      </section>

      <section className="site-container mt-20">
        <NewsletterSignup />
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Why Upgrade"
          title="The premium tier is the core product, not an afterthought."
          copy="Everything here should reinforce that the paid card is the main value. The affiliate and editorial layers support that story."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: Crown,
              title: "Full daily card",
              copy: "Premium members get the entire card, deeper notes, best bets, leans, and archived picks."
            },
            {
              icon: Newspaper,
              title: "Content-first brand",
              copy: "Articles, reviews, and clean editorial pages keep the site looking like a legitimate media property."
            },
            {
              icon: ArrowRight,
              title: "Affiliate as support",
              copy: "Sportsbook reviews and operator CTAs exist, but they never overpower the premium picks product."
            }
          ].map((item) => (
            <div key={item.title} className="panel p-6">
              <item.icon className="h-5 w-5 text-aqua" />
              <h3 className="mt-4 text-2xl uppercase text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Sportsbook Reviews"
          title="Affiliate pages stay clean, neutral, and second to the premium picks product."
          copy="These pages should feel editorial and trustworthy, with calm promo language and strong responsible-gaming context."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {sportsbooks.slice(0, 4).map((sportsbook) => (
            <SportsbookCard key={sportsbook.slug} sportsbook={sportsbook} />
          ))}
        </div>
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Recent Articles"
          title="Articles make the site feel like a real betting media property."
          copy=""
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <div className="mt-6">
          <Link href="/articles" className="cta-secondary">
            Browse all articles
          </Link>
        </div>
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Betting Guides"
          title="Guides make the site look like a serious long-term editorial platform."
          copy="These pages give affiliate managers and readers something deeper to evaluate than a single picks feed."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <ArticleCard key={guide.slug} article={guide} hrefPrefix="/guides" />
          ))}
        </div>
        <div className="mt-6">
          <Link href="/guides" className="cta-secondary">
            Browse all guides
          </Link>
        </div>
      </section>

      <section className="site-container mt-20 space-y-6">
        <DisclaimerBanner copy="Odds, offers, state availability, and operator terms vary. Picks are informational and opinion-based only." />
        <ResponsibleGamingBanner />
        <PremiumCtaBlock
          title="Make the membership offer feel sharp, measured, and worth paying for."
          copy="No hype, no fake guarantees, just a premium product centered on daily top picks and gated analysis."
        />
      </section>
    </div>
  );
}
