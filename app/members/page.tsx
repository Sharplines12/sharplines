import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, LockKeyhole, Trophy } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { CourseModuleCard } from "@/components/course-module-card";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { PickRow } from "@/components/pick-row";
import { PremiumBadge } from "@/components/premium-badge";
import { RecordTracker } from "@/components/record-tracker";
import { ResultsDayCard } from "@/components/results-day-card";
import {
  getArticles,
  getCourseModules,
  getDailyCards,
  getDashboardSavedArticleSlugs,
  getDashboardSavedPickIds,
  getResultsLedger,
  getTodayCard
} from "@/lib/content";
import {
  siteConfig,
} from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Member Dashboard`,
  description: `Protected member dashboard with today's premium card, archive access, saved content, and performance tracking.`
};

export default async function MembersDashboardPage() {
  const [todayCard, resultsLedger, dailyCards, articles, courseModules, savedArticleSlugs, savedPickIds] =
    await Promise.all([
      getTodayCard(),
      getResultsLedger(),
      getDailyCards(),
      getArticles(),
      getCourseModules(),
      getDashboardSavedArticleSlugs(),
      getDashboardSavedPickIds()
    ]);

  return (
    <div className="space-y-5">
      <div className="panel-strong p-8">
        <p className="muted-label">Member dashboard</p>
        <PremiumBadge className="mt-3" />
        <h1 className="mt-2 text-5xl uppercase text-white">Everything paying members need is one click away.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          This dashboard acts as the protected hub for the entire {siteConfig.name} product: today&apos;s bets, the
          premium archive, saved articles, and the course library.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Today's positions", value: `${todayCard.picks.length} live`, icon: CalendarDays },
            { label: "Protected modules", value: `${courseModules.length} unlocked`, icon: LockKeyhole },
            { label: "Recent record cards", value: `${resultsLedger.length} archived`, icon: Trophy }
          ].map((item) => (
            <DashboardStatCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">Next action</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Open today&apos;s full card</h2>
            </div>
            <Link href="/members/today" className="cta-primary">
              View picks
            </Link>
          </div>
          <p className="mt-4 text-sm leading-7">{todayCard.summary}</p>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">Archive</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Recent graded cards</h2>
            </div>
            <Link href="/members/archive" className="cta-secondary">
              Full archive
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {resultsLedger.slice(0, 2).map((day) => (
              <ResultsDayCard key={day.id} day={day} compact />
            ))}
          </div>
        </div>
      </div>

      <RecordTracker cards={dailyCards} />

      <div className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="muted-label">Course library</p>
            <h2 className="mt-2 text-3xl uppercase text-white">Keep the education attached to the picks.</h2>
          </div>
          <Link href="/members/course" className="cta-secondary">
            Go to course
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          {courseModules.map((module) => (
            <CourseModuleCard key={module.id} module={module} locked={false} />
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">Saved picks</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Keep priority plays easy to revisit.</h2>
            </div>
            <Link href="/premium-picks" className="cta-secondary">
              Full premium page
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {dailyCards
              .flatMap((card) => card.picks)
              .filter((pick) => savedPickIds.includes(pick.id))
              .map((pick) => (
                <PickRow key={pick.id} pick={pick} detailed />
              ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-aqua" />
            <h2 className="text-3xl uppercase text-white">Account and membership</h2>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: "Plan", value: "Premium monthly" },
              { label: "Status", value: "Active paid member" },
              { label: "Billing", value: "Stripe-backed subscription access" },
              { label: "Membership type", value: "Protected premium picks and archive" }
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <p className="muted-label">{item.label}</p>
                <p className="mt-2 text-sm text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="muted-label">Saved articles</p>
            <h2 className="mt-2 text-3xl uppercase text-white">Members can keep useful strategy reads close.</h2>
          </div>
          <Link href="/articles" className="cta-secondary">
            Browse all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {articles
            .filter((article) => savedArticleSlugs.includes(article.slug))
            .map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
      </div>
    </div>
  );
}
