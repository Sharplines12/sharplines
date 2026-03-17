import type { DailyCard } from "@/lib/data";
import { calculateProfitLoss } from "@/lib/picks";

export function buildRecordMetrics(cards: DailyCard[]) {
  const gradedPicks = cards.flatMap((day) => day.picks).filter((pick) => pick.result !== "pending");
  const totalRisked = gradedPicks.reduce((sum, pick) => sum + pick.units, 0);
  const wins = gradedPicks.filter((pick) => pick.result === "win").length;
  const losses = gradedPicks.filter((pick) => pick.result === "loss").length;
  const pushes = gradedPicks.filter((pick) => pick.result === "push").length;
  const units = gradedPicks.reduce((sum, pick) => sum + calculateProfitLoss(pick.result, pick.odds, pick.units), 0);
  const roi = totalRisked ? (units / totalRisked) * 100 : 0;

  const grouped = new Map<string, { wins: number; losses: number; pushes: number; units: number }>();

  for (const pick of gradedPicks) {
    const current = grouped.get(pick.sport) || { wins: 0, losses: 0, pushes: 0, units: 0 };

    if (pick.result === "win") {
      current.wins += 1;
      current.units += calculateProfitLoss(pick.result, pick.odds, pick.units);
    } else if (pick.result === "loss") {
      current.losses += 1;
      current.units += calculateProfitLoss(pick.result, pick.odds, pick.units);
    } else {
      current.pushes += 1;
    }

    grouped.set(pick.sport, current);
  }

  const latest = gradedPicks.slice().reverse();
  const first = latest[0];
  let streak = "No graded picks yet";

  if (first) {
    let count = 0;

    for (const pick of latest) {
      if (pick.result === first.result) {
        count += 1;
      } else {
        break;
      }
    }

    streak = `${count} ${first.result}${count > 1 ? "s" : ""}`;
  }

  return {
    totals: {
      wins,
      losses,
      pushes,
      units,
      roi,
      totalRisked
    },
    breakdown: Array.from(grouped.entries()).map(([sport, stats]) => ({
      sport,
      ...stats
    })),
    streak
  };
}
