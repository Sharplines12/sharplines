import type { CasinoSession } from "@/lib/data";
import type { DateRangeFilter, TimeframeKey } from "@/lib/performance";

export type CasinoMetricRow = {
  label: string;
  sessions: number;
  buyIn: number;
  cashOut: number;
  net: number;
  averageResult: number;
};

export type CasinoCumulativePoint = {
  label: string;
  date: string;
  net: number;
};

export type CasinoSnapshot = {
  totalSessions: number;
  totalBuyIn: number;
  totalCashOut: number;
  netProfitLoss: number;
  averageSessionResult: number;
  bestSession: CasinoSession | null;
  worstSession: CasinoSession | null;
  positiveSessions: number;
  negativeSessions: number;
  breakevenSessions: number;
  pendingEquivalentCount: number;
  byGameType: CasinoMetricRow[];
  byCasinoApp: CasinoMetricRow[];
  byMonth: CasinoMetricRow[];
  cumulativeNet: CasinoCumulativePoint[];
};

function filterByDateRange<T extends { date: string }>(items: T[], range?: DateRangeFilter) {
  if (!range?.start && !range?.end) {
    return items;
  }

  return items.filter((item) => {
    const value = new Date(`${item.date}T00:00:00`).getTime();
    const afterStart = range.start ? value >= new Date(`${range.start}T00:00:00`).getTime() : true;
    const beforeEnd = range.end ? value <= new Date(`${range.end}T23:59:59`).getTime() : true;
    return afterStart && beforeEnd;
  });
}

function filterByTimeframe<T extends { date: string }>(items: T[], timeframe: TimeframeKey, range?: DateRangeFilter) {
  if (timeframe === "custom") {
    return filterByDateRange(items, range);
  }

  if (timeframe === "all") {
    return items;
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

  return items.filter((item) => new Date(`${item.date}T00:00:00`).getTime() >= start.getTime());
}

function groupRows(items: CasinoSession[], key: (item: CasinoSession) => string): CasinoMetricRow[] {
  const map = new Map<string, CasinoSession[]>();

  for (const item of items) {
    const bucket = key(item);
    map.set(bucket, [...(map.get(bucket) || []), item]);
  }

  return Array.from(map.entries())
    .map(([label, values]) => {
      const buyIn = values.reduce((sum, item) => sum + item.buyIn, 0);
      const cashOut = values.reduce((sum, item) => sum + item.cashOut, 0);
      const net = values.reduce((sum, item) => sum + item.profitLoss, 0);
      return {
        label,
        sessions: values.length,
        buyIn,
        cashOut,
        net,
        averageResult: values.length ? net / values.length : 0
      };
    })
    .sort((left, right) => right.sessions - left.sessions || right.net - left.net);
}

function buildCumulativeNet(items: CasinoSession[]) {
  const ordered = [...items].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
  let running = 0;

  return ordered.map((item) => {
    running += item.profitLoss;
    return {
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${item.date}T00:00:00`)),
      date: item.date,
      net: Number(running.toFixed(2))
    };
  }).slice(-12);
}

export function buildCasinoPerformance(
  sessions: CasinoSession[],
  timeframe: TimeframeKey = "all",
  gameType = "All games",
  casinoApp = "All apps",
  range?: DateRangeFilter
) {
  const filtered = filterByTimeframe(
    sessions
      .filter((session) => (gameType === "All games" ? true : session.gameType === gameType))
      .filter((session) => (casinoApp === "All apps" ? true : session.casinoName === casinoApp))
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()),
    timeframe,
    range
  );

  const totalBuyIn = filtered.reduce((sum, item) => sum + item.buyIn, 0);
  const totalCashOut = filtered.reduce((sum, item) => sum + item.cashOut, 0);
  const netProfitLoss = filtered.reduce((sum, item) => sum + item.profitLoss, 0);

  return {
    totalSessions: filtered.length,
    totalBuyIn,
    totalCashOut,
    netProfitLoss,
    averageSessionResult: filtered.length ? netProfitLoss / filtered.length : 0,
    bestSession: [...filtered].sort((left, right) => right.profitLoss - left.profitLoss)[0] ?? null,
    worstSession: [...filtered].sort((left, right) => left.profitLoss - right.profitLoss)[0] ?? null,
    positiveSessions: filtered.filter((item) => item.profitLoss > 0).length,
    negativeSessions: filtered.filter((item) => item.profitLoss < 0).length,
    breakevenSessions: filtered.filter((item) => item.profitLoss === 0).length,
    pendingEquivalentCount: 0,
    byGameType: groupRows(filtered, (item) => item.gameType),
    byCasinoApp: groupRows(filtered, (item) => item.casinoName),
    byMonth: groupRows(filtered, (item) =>
      new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${item.date}T00:00:00`))
    ),
    cumulativeNet: buildCumulativeNet(filtered)
  } satisfies CasinoSnapshot;
}
