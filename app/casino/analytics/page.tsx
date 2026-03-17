import type { Metadata } from "next";
import { CasinoAnalyticsBrowser } from "@/components/casino-analytics-browser";
import { getCasinoSessions } from "@/lib/casino-sessions";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Casino Analytics`,
  description: `Review casino session analytics by timeframe, game type, casino app, and bankroll trend inside the dedicated Sharplines casino tracker.`
};

export default async function CasinoAnalyticsPage() {
  const session = await requireAuthenticatedUser("/casino/analytics");
  const sessions = await getCasinoSessions(session.id || "");

  return <CasinoAnalyticsBrowser sessions={sessions} premiumUser={isPaidAccess(session.role)} />;
}
