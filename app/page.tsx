import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Crown, LockKeyhole, Newspaper, Sparkles, Trophy, TrendingUp } from "lucide-react";
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
import { isCurrentDailyCard } from "@/lib/daily-card";
import { siteConfig } from "@/lib/data";
import { getArticles, getDailyCards, getGuides, getSportsbooks, getTodayCard } from "@/lib/content";
import { splitCardPicks } from "@/lib/pick-timing";
import { buildRecordMetrics } from "@/lib/record-metrics";
import { formatUnits } from "@/lib/utils";

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
  const hasCurrentCard = isCurrentDailyCard(todayCard);
  const { upcomingPicks, archivedPicks, freeUpcomingPicks, lockedUpcomingPicks, bestUpcomingPick, bestAvailablePick } =
    hasCurrentCard
      ? splitCardPicks(todayCard, "All sports", siteConfig.freePreviewCount)
      : {
          upcomingPicks: [],
          archivedPicks: [],
          freeUpcomingPicks: [],
          lockedUpcomingPicks: [],
          bestUpcomingPick: null,
          bestAvailablePick: null
        };
  const bestBet = hasCurrentCard ? bestUpcomingPick ?? bestAvailablePick : null;
  const metrics = buildRecordMetrics(dailyCards);
  const heroStats = [
    {
      icon: Trophy,
      label: "Record",
      value: `${metrics.totals.wins}-${metrics.totals.losses}-${metrics.totals.pushes}`
    },
    {
      icon: TrendingUp,
      label: "Units",
      value: formatUnits(metrics.totals.units)
    },
    {
      icon: ArrowRight,
      label: "ROI",
      value: `${metrics.totals.roi.toFixed(1)}%`
    }
  ];

  return (
    <div className="pb-16">
      <section className="site-container pt-10 sm:pt-16">
        <div className="panel-strong relative overflow-hidden px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="hero-orb right-0 top-0 h-40 w-40 bg-aqua/20" />
          <div className="hero-orb bottom-0 left-1/3 h-32 w-32 bg-neon/15" />
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-6">
              <span className="eyebrow">
                <Sparkles className="h-4 w-4" />
                Live card + premium analysis
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                  Sharp picks. Clean records. A premium card that actually looks credible.
                </h1>
                <p className="max-w-2xl text-lg text-mist/75 sm:text-xl">
                  {siteConfig.name} is built like a real betting media property first: daily top picks, a data-driven
                  approach, transparent performance tracking, calmer editorial coverage, and a protected premium card
                  without the spammy affiliate feel.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CheckoutButton className="cta-primary">
                  Unlock premium picks
                </CheckoutButton>
                <Link href="/signup" className="cta-secondary">
                  Create free account
                </Link>
              </div>
              <div className="rounded-[24px] border border-aqua/20 bg-aqua/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-aqua">Free account incentive</p>
                <p className="mt-3 text-sm leading-7 text-mist/80">
                  Sign up free to save your own bets, build a personal record, and have supported `moneyline`,
                  `spread`, and `total` tickets graded automatically on the midnight rollover.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-mist/55">
                      <item.icon className="h-4 w-4 text-aqua" />
                      <p className="text-xs uppercase tracking-[0.18em]">{item.label}</p>
                    </div>
                    <p className="mt-3 text-2xl font-display uppercase text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="panel p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="muted-label">{hasCurrentCard ? todayCard.date : "Awaiting today's board"}</p>
                    <h2 className="mt-2 text-3xl uppercase text-white">Today&apos;s card snapshot</h2>
                  </div>
                  <div className="rounded-full border border-neon/25 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
                    {hasCurrentCard ? (upcomingPicks.length ? "Live board" : "Archive view") : "Card pending"}
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-3">
                  <p className="text-5xl font-display uppercase text-white">{metrics.totals.wins}</p>
                  <p className="pb-1 text-sm uppercase tracking-[0.18em] text-mist/55">
                    Wins in the visible record sample
                  </p>
                </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                    {
                      label: "Upcoming preview",
                      value: hasCurrentCard ? `${freeUpcomingPicks.length} free picks` : "Waiting for publish",
                      href: "/daily-picks"
                    },
                    {
                      label: "Locked premium",
                      value: hasCurrentCard ? `${lockedUpcomingPicks.length} extra positions` : "Board not live yet",
                      href: "/pricing"
                    },
                    { label: "Best bet", value: bestBet?.pickTitle ?? "Awaiting today's top play", href: "/daily-picks" },
                    { label: "Free account", value: "Save bets + midnight auto-grading", href: "/signup" }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href as Route}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4 hover:border-aqua/30"
                    >
                      <p className="muted-label">{item.label}</p>
                      <p className="mt-2 text-base font-medium text-white">{item.value}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Why it converts</p>
                  <p className="mt-3 text-sm leading-7 text-mist/70">
                    The free layer stays useful, the locked layer stays visible, and transparent performance tracking
                    makes the product feel like a real operation instead of a one-page affiliate shell.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 rounded-full bg-neon/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-8">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="muted-label">Free account includes</p>
              <h2 className="mt-2 text-2xl uppercase text-white sm:text-3xl">
                Sportsbook tracking, casino session history, and year-to-date review before you ever upgrade.
              </h2>
            </div>
            <Link href="/signup" className="cta-primary">
              Create free account
            </Link>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {[
              "Sportsbook tracker with saved bet history and automatic midnight grading for core markets.",
              "Casino tracker with separate session-based bankroll logs.",
              "History, monthly, YTD, and all-time views inside your account.",
              "Upgrade later for deeper analytics, compare tools, and premium picks."
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-mist/75">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container mt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Today&apos;s card</span>
            <h2 className="mt-5 text-4xl uppercase leading-none text-white sm:text-5xl">
              The homepage is built to read like the front page of the picks product.
            </h2>
          </div>
          <Link href="/daily-picks" className="cta-secondary">
            View full daily board
          </Link>
        </div>
        <div className="space-y-6">
          {bestBet ? <BestBetBanner pick={bestBet} locked /> : null}
          {!hasCurrentCard ? (
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Card pending</p>
              <h3 className="mt-3 text-3xl uppercase text-white">Today&apos;s board has not been published yet.</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/70">
                The record tracker below is current, but the homepage best-bet slot now waits for a same-day card
                instead of recycling yesterday&apos;s featured play.
              </p>
            </div>
          ) : upcomingPicks.length ? (
            <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="grid gap-4">
                {freeUpcomingPicks.map((pick) => (
                  <PickRow key={pick.id} pick={pick} />
                ))}
              </div>
              <div className="grid gap-4">
                {lockedUpcomingPicks.map((pick) => (
                  <LockedPickCard key={pick.id} pick={pick} />
                ))}
                <div className="panel p-5">
                  <div className="flex items-center gap-3">
                    <LockKeyhole className="h-5 w-5 text-neon" />
                    <p className="text-sm text-white">
                      Premium members unlock the rest of the card, deeper writeups, and archived notes.
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
                  <h3 className="mt-2 text-3xl uppercase text-white">Earlier starts roll down into the archive view.</h3>
                </div>
                <Link href="/results" className="text-sm uppercase tracking-[0.18em] text-aqua hover:text-white">
                  See full results
                </Link>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
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
        <SectionHeading
          eyebrow="Member Tools"
          title="A free account gives users a reason to come back tomorrow."
          copy="Sharplines is also a utility product. Once users sign in, they can save bets to their own account, track sportsbook and casino activity, review history, and let supported bets settle automatically at rollover."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Sportsbook Tracker",
                copy: "Track the exact sportsbook, line, odds, stake, and units you took inside a dedicated sportsbook dashboard."
              },
              {
                title: "Casino Tracker",
                copy: "Track casino sessions separately with buy-in, cash-out, notes, and bankroll trend views so it never gets mixed into sportsbook ROI."
              },
              {
                title: "Midnight auto-grading",
                copy: "Supported moneyline, spread, and total bets can now settle automatically during the daily rollover, so users do not need to grade every ticket by hand."
              },
              {
                title: "History + YTD review",
                copy: "Free accounts can already review tracked history and broader timeframe views. Premium expands the filter depth and analytics."
              }
            ].map((item) => (
              <div key={item.title} className="panel p-6">
                <p className="muted-label">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-mist/75">{item.copy}</p>
              </div>
            ))}
          </div>
          <div className="panel p-6">
            <p className="muted-label">How it works</p>
            <h2 className="mt-3 text-3xl uppercase text-white">Create the free account for the tracker, then decide on premium.</h2>
            <p className="mt-4 text-sm leading-7 text-mist/75">
              The cleanest conversion path is simple: free users get a real personal utility layer right away, and premium stays focused on the live card, deeper analysis, and pregame access.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="cta-primary">
                Start free tracker
              </Link>
              <Link href="/pricing" className="cta-secondary">
                See premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-20">
        <NewsletterSignup />
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Why Sharplines"
          title="A premium picks brand built on process, not hype."
          copy="Sharplines is built to show how a data-driven approach, transparent results tracking, a structured unit system, and a consistent methodology can support long-term consistency."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Data-driven picks",
                copy: "Each card is framed around matchup context, market pricing, and disciplined thresholds rather than one-line opinions."
              },
              {
                title: "Transparent results tracking",
                copy: "Public wins, losses, pushes, and unit movement stay visible so performance can be reviewed over time."
              },
              {
                title: "Structured unit system",
                copy: "Featured plays, standard positions, and smaller leans are separated so card sizing stays clear and measurable."
              },
              {
                title: "Consistent methodology",
                copy: "The site is built around disciplined betting, analysis-based decisions, and long-term consistency instead of short-term hype."
              }
            ].map((item) => (
              <div key={item.title} className="panel p-6">
                <p className="muted-label">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-mist/75">{item.copy}</p>
              </div>
            ))}
          </div>
          <div className="panel p-6">
            <p className="muted-label">Explore the brand</p>
            <h2 className="mt-3 text-3xl uppercase text-white">Trust signals should route somewhere useful.</h2>
            <p className="mt-4 text-sm leading-7 text-mist/75">
              Sharplines works best when readers can move naturally between the live card, sportsbook reviews, betting
              education, and responsible gaming language without the site feeling cluttered or sales-heavy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/daily-picks" className="cta-secondary">
                Daily Picks
              </Link>
              <Link href="/sportsbooks" className="cta-secondary">
                Sportsbooks
              </Link>
              <Link href="/guides" className="cta-secondary">
                Guides
              </Link>
              <Link href="/responsible-gaming" className="cta-secondary">
                Responsible Gaming
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Why Upgrade"
          title="The premium tier is the core product, not an afterthought."
          copy="Everything on the public side points clearly toward the paid card. The affiliate and editorial layers support that product story without overpowering it."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: Crown,
              title: "Full daily card",
              copy: "Premium members get the entire card, deeper notes, best bets, leans, and archived picks with a disciplined betting framework."
            },
            {
              icon: Newspaper,
              title: "Content-first brand",
              copy: "Articles, reviews, and clean editorial pages keep the site looking like a legitimate media property with long-term consistency."
            },
            {
              icon: ArrowRight,
              title: "Affiliate as support",
              copy: "Sportsbook reviews and operator CTAs exist, but they never overpower the premium picks product or the analysis-based approach."
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
          eyebrow="Why The Brand Travels"
          title="Sharplines works better when it reads like education, comparison, and analysis under one roof."
          copy="The picks product stays at the center, but the surrounding content makes the brand feel broader, more useful, and more credible to both readers and operators."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Betting education site",
              copy:
                "Guides explain bankroll discipline, market basics, odds formats, line reading, and how welcome offers actually work so newer users can learn the language before they ever hit a premium paywall."
            },
            {
              title: "Odds comparison mindset",
              copy:
                "Sportsbook pages and daily-card notes reinforce the habit of comparing prices, checking market movement, and understanding that a number at one operator is not always the same edge somewhere else."
            },
            {
              title: "Analysis blog",
              copy:
                "Articles and matchup writing give Sharplines a real editorial voice. That layer helps the brand feel informed and current instead of looking like a one-dimensional picks funnel."
            }
          ].map((item) => (
            <div key={item.title} className="panel p-6">
              <p className="muted-label">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-mist/75">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container mt-20">
        <SectionHeading
          eyebrow="Sportsbook Reviews"
          title="Affiliate pages stay clean, neutral, and second to the premium picks product."
          copy="These pages stay editorial and trustworthy, with calm promo language, price-shopping context, and clear responsible-gaming language that supports disciplined betting."
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
          copy="Analysis writing gives Sharplines a point of view, keeps the site current, and supports long-term consistency around the picks product."
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
          copy="These pages give affiliate managers and readers something deeper to evaluate than a single picks feed, especially around education, line-shopping behavior, and a data-driven approach."
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
