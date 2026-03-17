import type { Metadata } from "next";
import { CasinoHistoryBrowser } from "@/components/casino-history-browser";
import { getCasinoSessions } from "@/lib/casino-sessions";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Casino History`,
  description: `Browse your full casino session history with filters, search, and bankroll-focused reporting that stays separate from sportsbook bet history.`
};

export default async function CasinoHistoryPage() {
  const session = await requireAuthenticatedUser("/casino/history");
  const sessions = await getCasinoSessions(session.id || "");

  return <CasinoHistoryBrowser sessions={sessions} premiumUser={isPaidAccess(session.role)} />;
}
