import type { Metadata } from "next";
import { BetHistoryBrowser } from "@/components/bet-history-browser";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { getUserBets } from "@/lib/user-bets";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Bet History`,
  description: `Browse your complete tracked bet history with filters, search, results, and responsive record management inside ${siteConfig.name}.`
};

export default async function DashboardHistoryPage() {
  const session = await requireAuthenticatedUser("/dashboard/history");
  const bets = await getUserBets(session.id || "");

  return <BetHistoryBrowser bets={bets} premiumUser={isPaidAccess(session.role)} />;
}
