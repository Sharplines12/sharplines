import { getHistoricalPicks } from "@/lib/picks";
import type { DailyCard, PickResult, UserBet } from "@/lib/data";

export type TimeframeKey = "today" | "7d" | "30d" | "mtd" | "ytd" | "all" | "custom";

export type DateRangeFilter = {
  start?: string;
  end?: string;
};

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
  stake: number;
};

export type CumulativePoint = {
  label: string;
  date: string;
  units: number;
};

export type StreakInfo = {
  type: PickResult | "none";
  length: number;
  label: string;
};

export type PerformanceSnapshot = {
  wins: number;
  losses: number;
  pushes: number;
  pendingCount: number;
  settledCount: number;
  totalBets: number;
  winRate: number;
  units: number;
  totalRisked: number;
  totalAmountWagered: number;
  roi: number;
  averageOdds: number | null;
  averageStake: number;
  recentForm: PickResult[];
  currentStreak: StreakInfo;
  longestWinStreak: number;
  longestLossStreak: number;
  bySport: MetricRow[];
  byLeague: MetricRow[];
  bySportsbook: MetricRow[];
  byBetType: MetricRow[];
  byMonth: MetricRow[];
  cumulativeUnits: CumulativePoint[];
  winLossDistribution: Array<{ label: string; value: number; tone: "neon" | "rose" | "mist" }>;
};

type TrackableBet = {
  date: string;
  sport: string;
  league: string;
  sportsbook: string;
  betType: string;
  odds: string;
  units: number;
  stake: number;
  result: PickResult;
  profitLoss: number;
};

function parseOddsValue(odds: string) {
  const numeric = Number(odds.replace(/[^\d+-]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function filterByDateRange<T extends { date: string }>(bets: T[], range?: DateRangeFilter) {
  if (!range?.start && !range?.end) {
    return bets;
  }

  return bets.filter((bet) => {
    const value = new Date(`${bet.date}T00:00:00`).getTime();
    const afterStart = range.start ? value >= new Date(`${range.start}T00:00:00`).getTime() : true;
    const beforeEnd = range.end ? value <= new Date(`${range.end}T23:59:59`).getTime() : true;
    return afterStart && beforeEnd;
  });
}

function filterByTimeframe<T extends { date: string }>(bets: T[], timeframe: TimeframeKey, range?: DateRangeFilter) {
  if (timeframe === "custom") {
    return filterByDateRange(bets, range);
  }

  if (timeframe === "all") {
    return bets;
  }

  const now = new Date();
  const start = new Date(now);

  if (timeframe === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (timeframe === "7d") {
    start.setDate(now.getDate() - 7);
  } else if (timeframe === "30d") {
    start.setDate(now.getDate() - 30);
  } else if (timeframe === "mtd") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (timeframe === "ytd") {
    start.setMonth(0, 1);
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
      const stake = values.reduce((sum, bet) => sum + bet.stake, 0);

      return {
        label,
        wins,
        losses,
        pushes,
        totalBets,
        winRate: wins + losses ? (wins / (wins + losses)) * 100 : 0,
        units,
        risked,
        roi: risked ? (units / risked) * 100 : 0,
        stake
      };
    })
    .sort((left, right) => right.totalBets - left.totalBets || right.units - left.units);
}

function buildCurrentStreak(bets: TrackableBet[]): StreakInfo {
  const ordered = [...bets]
    .filter((bet) => bet.result !== "pending")
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  if (!ordered.length) {
    return {
      type: "none",
      length: 0,
      label: "No settled streak yet"
    };
  }

  const currentResult = ordered[0].result;
  let length = 0;

  for (const bet of ordered) {
    if (bet.result !== currentResult) {
      break;
    }

    length += 1;
  }

  return {
    type: currentResult,
    length,
    label: `${length}-${currentResult} streak`
  };
}

function buildLongestStreak(bets: TrackableBet[], target: "win" | "loss") {
  const ordered = [...bets]
    .filter((bet) => bet.result !== "pending")
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
  let best = 0;
  let current = 0;

  for (const bet of ordered) {
    if (bet.result === target) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

function buildCumulativeUnits(bets: TrackableBet[]) {
  const ordered = [...bets]
    .filter((bet) => bet.result !== "pending")
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
  const points: CumulativePoint[] = [];
  let runningUnits = 0;

  for (const bet of ordered) {
    runningUnits += bet.profitLoss;
    const date = new Date(`${bet.date}T00:00:00`);
    points.push({
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date),
      date: bet.date,
      units: Number(runningUnits.toFixed(2))
    });
  }

  return points.slice(-12);
}

function buildSnapshotFromBets(rawBets: TrackableBet[]) {
  const settled = rawBets.filter((bet) => bet.result !== "pending");
  const wins = settled.filter((bet) => bet.result === "win").length;
  const losses = settled.filter((bet) => bet.result === "loss").length;
  const pushes = settled.filter((bet) => bet.result === "push").length;
  const pendingCount = rawBets.filter((bet) => bet.result === "pending").length;
  const totalBets = rawBets.length;
  const settledCount = settled.length;
  const totalRisked = settled.reduce((sum, bet) => sum + bet.units, 0);
  const totalAmountWagered = settled.reduce((sum, bet) => sum + bet.stake, 0);
  const units = settled.reduce((sum, bet) => sum + bet.profitLoss, 0);
  const pricedBets = settled.map((bet) => parseOddsValue(bet.odds)).filter((value): value is number => value !== null);
  const averageOdds = pricedBets.length ? pricedBets.reduce((sum, value) => sum + value, 0) / pricedBets.length : null;
  const averageStake = settledCount ? totalAmountWagered / settledCount : 0;

  return {
    wins,
    losses,
    pushes,
    pendingCount,
    settledCount,
    totalBets,
    winRate: wins + losses ? (wins / (wins + losses)) * 100 : 0,
    units,
    totalRisked,
    totalAmountWagered,
    roi: totalRisked ? (units / totalRisked) * 100 : 0,
    averageOdds,
    averageStake,
    recentForm: settled.slice(0, 8).map((bet) => bet.result),
    currentStreak: buildCurrentStreak(settled),
    longestWinStreak: buildLongestStreak(settled, "win"),
    longestLossStreak: buildLongestStreak(settled, "loss"),
    bySport: groupMetrics(settled, (bet) => bet.sport),
    byLeague: groupMetrics(settled, (bet) => bet.league),
    bySportsbook: groupMetrics(settled, (bet) => bet.sportsbook),
    byBetType: groupMetrics(settled, (bet) => bet.betType),
    byMonth: groupMetrics(settled, (bet) => {
      const date = new Date(`${bet.date}T00:00:00`);
      return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
    }),
    cumulativeUnits: buildCumulativeUnits(settled),
    winLossDistribution: [
      { label: "Wins", value: wins, tone: "neon" as const },
      { label: "Losses", value: losses, tone: "rose" as const },
      { label: "Pushes", value: pushes, tone: "mist" as const },
      { label: "Pending", value: pendingCount, tone: "mist" as const }
    ]
  } satisfies PerformanceSnapshot;
}

export function buildSharplinesPerformance(
  cards: DailyCard[],
  timeframe: TimeframeKey = "all",
  sport = "All sports",
  range?: DateRangeFilter
) {
  const picks = getHistoricalPicks(cards)
    .filter((pick) => (sport === "All sports" ? true : pick.sport === sport))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  const filtered = filterByTimeframe(picks, timeframe, range);

  return buildSnapshotFromBets(
    filtered.map((pick) => ({
      date: pick.date,
      sport: pick.sport,
      league: pick.league,
      sportsbook: pick.sportsbook,
      betType: pick.betType,
      odds: pick.odds,
      units: pick.units,
      stake: pick.units,
      result: pick.result,
      profitLoss: pick.profitLoss
    }))
  );
}

export function buildUserPerformance(
  bets: UserBet[],
  timeframe: TimeframeKey = "all",
  sport = "All sports",
  range?: DateRangeFilter
) {
  const filtered = filterByTimeframe(
    bets
      .filter((bet) => (sport === "All sports" ? true : bet.sport === sport))
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()),
    timeframe,
    range
  );

  return buildSnapshotFromBets(
    filtered.map((bet) => ({
      date: bet.date,
      sport: bet.sport,
      league: bet.league,
      sportsbook: bet.sportsbook,
      betType: bet.betType,
      odds: bet.odds,
      units: bet.units,
      stake: bet.stake,
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
