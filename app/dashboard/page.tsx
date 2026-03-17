import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, ListChecks, LockKeyhole } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { PerformanceTrendChart } from "@/components/performance-trend-chart";
import { getDailyCards } from "@/lib/content";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { getUserBets } from "@/lib/user-bets";
import { buildSharplinesPerformance, buildUserPerformance } from "@/lib/performance";
import { siteConfig } from "@/lib/data";
import { formatUnits } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Dashboard`,
  description: `Authenticated dashboard for tracking your bets, comparing results, and managing premium access in ${siteConfig.name}.`
};

export default async function DashboardPage() {
  const session = await requireAuthenticatedUser("/dashboard");
  const [cards, userBets] = await Promise.all([getDailyCards(), getUserBets(session.id || "")]);
  const paidAccess = isPaidAccess(session.role);
  const sharplines = buildSharplinesPerformance(cards);
  const userPerformance = buildUserPerformance(userBets);

  return (
    <div className="space-y-5">
      <div className="panel-strong p-8">
        <p className="muted-label">Dashboard overview</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Track your process next to Sharplines.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/75">
          Your dashboard keeps personal bet tracking, Sharplines comparison, and premium access in one place. The public product stays transparent on the back end while your account tools stay focused on disciplined review.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard label="Your tracked bets" value={String(userPerformance.totalBets)} icon={ListChecks} />
          <DashboardStatCard label="Your ROI" value={`${userPerformance.roi.toFixed(1)}%`} icon={BarChart3} />
          <DashboardStatCard label="Your units" value={formatUnits(userPerformance.units)} icon={BookOpen} />
          <DashboardStatCard label="Membership" value={paidAccess ? "Premium" : "Free"} icon={LockKeyhole} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6">
          <p className="muted-label">Your betting log</p>
          <h2 className="mt-2 text-3xl uppercase text-white">Manual tracking is live.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Log your own bets, settle them manually, and compare the personal record against Sharplines&apos; public archive and performance pages.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/my-bets" className="cta-primary">
              Open my bets
            </Link>
            <Link href="/dashboard/compare" className="cta-secondary">
              Compare records
            </Link>
          </div>
        </div>

        <div className="panel p-6">
          <p className="muted-label">Sharplines public record</p>
          <h2 className="mt-2 text-3xl uppercase text-white">The trust layer stays visible.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">All-time record</p>
              <p className="mt-2 text-3xl uppercase text-white">
                {sharplines.wins}-{sharplines.losses}-{sharplines.pushes}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Sharplines ROI</p>
              <p className="mt-2 text-3xl uppercase text-neon">{sharplines.roi.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/performance" className="cta-secondary">
              Public performance
            </Link>
            <Link href="/archive" className="cta-secondary">
              Public archive
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="panel p-6">
          <p className="muted-label">Free utility</p>
          <h2 className="mt-2 text-2xl uppercase text-white">Archive + results</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Past Sharplines picks, results, and record tracking remain public so your account can compare against a full historical trail.
          </p>
        </div>
        <div className="panel p-6">
          <p className="muted-label">Premium utility</p>
          <h2 className="mt-2 text-2xl uppercase text-white">Gate the future</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Paying members unlock today&apos;s full card before games start, plus deeper writeups, premium-only positions, and the protected workspace.
          </p>
        </div>
        <div className="panel p-6">
          <p className="muted-label">Methodology</p>
          <h2 className="mt-2 text-2xl uppercase text-white">No outcome is guaranteed.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Sharplines emphasizes transparent tracking, disciplined betting, and long-term accountability over hype or short-term screenshots.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <PerformanceTrendChart
          rows={sharplines.byMonth}
          title="Sharplines monthly trend"
          copy="Public monthly units make it easier to judge whether the Sharplines card is tracking with discipline over time."
        />
        <PerformanceTrendChart
          rows={userPerformance.byMonth}
          title="Your monthly trend"
          copy="Your tracker becomes more useful once you can see how your own record has moved month by month."
          accent="aqua"
        />
      </div>

      <div className="panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="muted-label">{paidAccess ? "Premium access" : "Upgrade path"}</p>
            <h2 className="mt-2 text-3xl uppercase text-white">
              {paidAccess ? "Open the protected Sharplines workspace." : "Unlock today’s full card before games start."}
            </h2>
          </div>
          <Link href={paidAccess ? "/members" : "/pricing"} className="cta-primary">
            {paidAccess ? "Go to premium workspace" : "View premium plan"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
