import { getHistoricalPicks } from "@/lib/picks";
import type { DailyCard, PickResult, UserBet } from "@/lib/data";

export type TimeframeKey = "7d" | "30d" | "mtd" | "all";

export type MetricRow = {
  label: string;
  wins: number;
  losses: number;
  pushes: number;
  totalBets: number;
  winRate: number;
  units: number;
  risked: number;
  roi: number;
};

export type PerformanceSnapshot = {
  wins: number;
  losses: number;
  pushes: number;
  totalBets: number;
  winRate: number;
  units: number;
  totalRisked: number;
  roi: number;
  averageOdds: number | null;
  averageStake: number;
  recentForm: PickResult[];
  bySport: MetricRow[];
  byLeague: MetricRow[];
  byMonth: MetricRow[];
};

type TrackableBet = {
  date: string;
  sport: string;
  league: string;
  odds: string;
  units: number;
  result: PickResult;
  profitLoss: number;
};

function parseOddsValue(odds: string) {
  const numeric = Number(odds.replace(/[^\d+-]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function filterByTimeframe<T extends { date: string }>(bets: T[], timeframe: TimeframeKey) {
  if (timeframe === "all") {
    return bets;
  }

  const now = new Date();
  const start = new Date(now);

  if (timeframe === "7d") {
    start.setDate(now.getDate() - 7);
  } else if (timeframe === "30d") {
    start.setDate(now.getDate() - 30);
  } else if (timeframe === "mtd") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return bets.filter((bet) => new Date(`${bet.date}T00:00:00`).getTime() >= start.getTime());
}

function groupMetrics(bets: TrackableBet[], key: (bet: TrackableBet) => string): MetricRow[] {
  const map = new Map<string, TrackableBet[]>();

  for (const bet of bets) {
    const bucket = key(bet);
    map.set(bucket, [...(map.get(bucket) || []), bet]);
  }

  return Array.from(map.entries())
    .map(([label, values]) => {
      const wins = values.filter((bet) => bet.result === "win").length;
      const losses = values.filter((bet) => bet.result === "loss").length;
      const pushes = values.filter((bet) => bet.result === "push").length;
      const totalBets = wins + losses + pushes;
      const units = values.reduce((sum, bet) => sum + bet.profitLoss, 0);
      const risked = values.reduce((sum, bet) => sum + bet.units, 0);

      return {
        label,
        wins,
        losses,
        pushes,
        totalBets,
        winRate: totalBets ? (wins / (wins + losses || 1)) * 100 : 0,
        units,
        risked,
        roi: risked ? (units / risked) * 100 : 0
      };
    })
    .sort((left, right) => right.totalBets - left.totalBets || right.units - left.units);
}

function buildSnapshotFromBets(rawBets: TrackableBet[]) {
  const bets = rawBets.filter((bet) => bet.result !== "pending");
  const wins = bets.filter((bet) => bet.result === "win").length;
  const losses = bets.filter((bet) => bet.result === "loss").length;
  const pushes = bets.filter((bet) => bet.result === "push").length;
  const totalBets = wins + losses + pushes;
  const totalRisked = bets.reduce((sum, bet) => sum + bet.units, 0);
  const units = bets.reduce((sum, bet) => sum + bet.profitLoss, 0);
  const pricedBets = bets.map((bet) => parseOddsValue(bet.odds)).filter((value): value is number => value !== null);
  const averageOdds = pricedBets.length ? pricedBets.reduce((sum, value) => sum + value, 0) / pricedBets.length : null;
  const averageStake = totalBets ? totalRisked / totalBets : 0;

  return {
    wins,
    losses,
    pushes,
    totalBets,
    winRate: wins + losses ? (wins / (wins + losses)) * 100 : 0,
    units,
    totalRisked,
    roi: totalRisked ? (units / totalRisked) * 100 : 0,
    averageOdds,
    averageStake,
    recentForm: bets.slice(0, 8).map((bet) => bet.result),
    bySport: groupMetrics(bets, (bet) => bet.sport),
    byLeague: groupMetrics(bets, (bet) => bet.league),
    byMonth: groupMetrics(bets, (bet) => {
      const date = new Date(`${bet.date}T00:00:00`);
      return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
    })
  } satisfies PerformanceSnapshot;
}

export function buildSharplinesPerformance(cards: DailyCard[], timeframe: TimeframeKey = "all", sport = "All sports") {
  const picks = getHistoricalPicks(cards)
    .filter((pick) => pick.result !== "pending")
    .filter((pick) => (sport === "All sports" ? true : pick.sport === sport));
  const filtered = filterByTimeframe(picks, timeframe).sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  return buildSnapshotFromBets(
    filtered.map((pick) => ({
      date: pick.date,
      sport: pick.sport,
      league: pick.league,
      odds: pick.odds,
      units: pick.units,
      result: pick.result,
      profitLoss: pick.profitLoss
    }))
  );
}

export function buildUserPerformance(bets: UserBet[], timeframe: TimeframeKey = "all", sport = "All sports") {
  const filtered = filterByTimeframe(
    bets
      .filter((bet) => bet.result !== "pending")
      .filter((bet) => (sport === "All sports" ? true : bet.sport === sport)),
    timeframe
  ).sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  return buildSnapshotFromBets(
    filtered.map((bet) => ({
      date: bet.date,
      sport: bet.sport,
      league: bet.league,
      odds: bet.odds,
      units: bet.units,
      result: bet.result,
      profitLoss: bet.profitLoss
    }))
  );
}

export function listSupportedSports(cards: DailyCard[], bets: UserBet[] = []) {
  return Array.from(
    new Set([
      ...getHistoricalPicks(cards).map((pick) => pick.sport),
      ...bets.map((bet) => bet.sport)
    ])
  ).sort();
}
