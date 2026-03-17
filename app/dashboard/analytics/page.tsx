import type { Metadata } from "next";
import { UserAnalyticsBrowser } from "@/components/user-analytics-browser";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { getDailyCards } from "@/lib/content";
import { siteConfig } from "@/lib/data";
import { getUserBets } from "@/lib/user-bets";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Analytics`,
  description: `Review personal betting analytics, timeframe filters, category breakdowns, streaks, and chart views inside the ${siteConfig.name} dashboard.`
};

export default async function DashboardAnalyticsPage() {
  const session = await requireAuthenticatedUser("/dashboard/analytics");
  const [cards, bets] = await Promise.all([getDailyCards(), getUserBets(session.id || "")]);

  return <UserAnalyticsBrowser cards={cards} userBets={bets} premiumUser={isPaidAccess(session.role)} />;
}

