import type { Metadata } from "next";
import { PerformanceBrowser } from "@/components/performance-browser";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getDailyCards } from "@/lib/content";
import { getUserBets } from "@/lib/user-bets";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Compare`,
  description: `Compare your tracked record against the public Sharplines record with ROI, units, sport breakdowns, and recent form.`
};

export default async function DashboardComparePage() {
  const session = await requireAuthenticatedUser("/dashboard/compare");
  const [cards, userBets] = await Promise.all([getDailyCards(), getUserBets(session.id || "")]);

  return (
    <PerformanceBrowser
      cards={cards}
      userBets={userBets}
      compareMode
      title="Your card versus the Sharplines public record."
      copy="Use the compare view to see how your manual tracker stacks up against Sharplines by timeframe, sport, ROI, units, and recent form. The goal is accountability, not hype."
    />
  );
}
