import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Landmark, ScrollText, ShieldCheck } from "lucide-react";
import { CasinoSessionManager } from "@/components/casino-session-manager";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { CasinoCumulativeChart } from "@/components/casino-cumulative-chart";
import { getCasinoSessions } from "@/lib/casino-sessions";
import { buildCasinoPerformance } from "@/lib/casino-performance";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { siteConfig } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Casino Overview`,
  description: `Track casino sessions separately from sportsbook bets with a dedicated overview, bankroll trend, and session management tools inside ${siteConfig.name}.`
};

export default async function CasinoPage() {
  const session = await requireAuthenticatedUser("/casino");
  const premiumUser = isPaidAccess(session.role);
  const sessions = await getCasinoSessions(session.id || "");
  const snapshot = buildCasinoPerformance(sessions);

  return (
    <div className="space-y-6">
      <div className="panel-strong p-8">
        <p className="muted-label">Casino tracker overview</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Session-based tracking for casino play.</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-mist/75">
          This side of Sharplines keeps casino sessions in their own bankroll product. Buy-ins, cash-outs, and game-type swings stay separate from sportsbook ROI, units, and Sharplines pick analysis.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard label="Sessions" value={String(snapshot.totalSessions)} icon={Landmark} />
          <DashboardStatCard label="Net result" value={formatCurrency(snapshot.netProfitLoss)} icon={BarChart3} />
          <DashboardStatCard label="Best session" value={formatCurrency(snapshot.bestSession?.profitLoss || 0)} icon={ShieldCheck} />
          <DashboardStatCard label="Membership" value={premiumUser ? "Premium" : "Free"} icon={ScrollText} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CasinoCumulativeChart
          title="Bankroll trend"
          copy="The cumulative trend makes it easy to see whether casino sessions are adding variance or improving over time."
          points={snapshot.cumulativeNet}
        />
        <div className="panel p-6">
          <p className="muted-label">Separate tracker logic</p>
          <h2 className="mt-2 text-3xl uppercase text-white">Sportsbook and casino stay in separate lanes.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Sportsbook tracking stays under the bet-based dashboard with odds, units, and ROI. Casino tracking stays here as a session log with buy-in, cash-out, and bankroll movement.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/casino/history" className="cta-secondary">
              Session history
            </Link>
            <Link href="/casino/analytics" className="cta-secondary">
              Casino analytics
            </Link>
            <Link href="/dashboard" className="cta-primary">
              Sportsbook tracker
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <CasinoSessionManager sessions={sessions} premiumUser={premiumUser} />
    </div>
  );
}
