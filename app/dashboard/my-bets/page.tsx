import type { Metadata } from "next";
import { UserBetsManager } from "@/components/user-bets-manager";
import { requireAuthenticatedUser, isPaidAccess } from "@/lib/auth";
import { getUserBets } from "@/lib/user-bets";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | My Bets`,
  description: `Track your own bets, review your personal betting log, and compare against Sharplines inside the authenticated dashboard.`
};

export default async function DashboardMyBetsPage() {
  const session = await requireAuthenticatedUser("/dashboard/my-bets");
  const bets = await getUserBets(session.id || "");

  return <UserBetsManager bets={bets} premiumUser={isPaidAccess(session.role)} />;
}
