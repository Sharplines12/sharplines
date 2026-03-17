import type { DailyCard, PickEntry, PickResult } from "@/lib/data";

export type PickArchiveEntry = PickEntry & {
  cardId: string;
  cardDate: string;
  cardHeadline: string;
  recordLabel: string;
  postedAt: string;
  updatedAt: string;
  settledAt: string | null;
  profitLoss: number;
  isPremium: boolean;
  closingStatus: "open" | "started" | "settled";
  slug: string;
  hasStarted: boolean;
};

const EASTERN_TIMEZONE = "America/New_York";

function parseAmericanOdds(odds: string) {
  const numeric = Number(odds.replace(/[^\d+-]/g, ""));

  if (!Number.isFinite(numeric) || numeric === 0) {
    return null;
  }

  return numeric;
}

export function calculateProfitLoss(result: PickResult, odds: string, units: number) {
  if (result === "push" || result === "pending") {
    return 0;
  }

  if (result === "loss") {
    return -units;
  }

  const parsedOdds = parseAmericanOdds(odds);

  if (!parsedOdds) {
    return units * 0.91;
  }

  if (parsedOdds > 0) {
    return units * (parsedOdds / 100);
  }

  return units * (100 / Math.abs(parsedOdds));
}

function toEasternDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function parsePickStart(date: string, startTime: string) {
  const [year, month, day] = date.split("-").map(Number);
  const match = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!year || !month || !day || !match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  return new Date(Date.UTC(year, month - 1, day, hour + 4, minute));
}

function derivePostedAt(startDate: Date | null, index: number) {
  if (!startDate) {
    return new Date(Date.UTC(2026, 2, 16, 5, index * 3)).toISOString();
  }

  const posted = new Date(startDate.getTime() - (6 * 60 + index * 5) * 60 * 1000);
  return posted.toISOString();
}

function deriveUpdatedAt(postedAt: string, result: PickResult, startDate: Date | null) {
  if (result === "pending") {
    return postedAt;
  }

  if (!startDate) {
    return postedAt;
  }

  return new Date(startDate.getTime() + 3 * 60 * 60 * 1000).toISOString();
}

function deriveSettledAt(result: PickResult, startDate: Date | null) {
  if (result === "pending" || !startDate) {
    return null;
  }

  return new Date(startDate.getTime() + 3 * 60 * 60 * 1000).toISOString();
}

export function flattenDailyCards(cards: DailyCard[], now = new Date()) {
  return cards.flatMap((card) =>
    card.picks.map((pick, index) => {
      const startDate = parsePickStart(pick.date, pick.startTime);
      const hasStarted = startDate ? startDate.getTime() <= now.getTime() : pick.result !== "pending";
      const postedAt = pick.postedAt ?? derivePostedAt(startDate, index);
      const updatedAt = pick.updatedAt ?? deriveUpdatedAt(postedAt, pick.result, startDate);
      const settledAt = pick.settledAt ?? deriveSettledAt(pick.result, startDate);
      const closingStatus =
        pick.closingStatus ?? (pick.result !== "pending" ? "settled" : hasStarted ? "started" : "open");

      return {
        ...pick,
        cardId: card.id,
        cardDate: card.date,
        cardHeadline: card.headline,
        recordLabel: card.recordLabel,
        postedAt,
        updatedAt,
        settledAt,
        profitLoss: pick.profitLoss ?? calculateProfitLoss(pick.result, pick.odds, pick.units),
        isPremium: pick.isPremium ?? Boolean(pick.premiumAnalysis),
        closingStatus,
        slug: pick.slug ?? pick.id,
        hasStarted
      } satisfies PickArchiveEntry;
    })
  );
}

export function getHistoricalPicks(cards: DailyCard[], now = new Date()) {
  return flattenDailyCards(cards, now).filter((pick) => pick.hasStarted || pick.result !== "pending");
}

export function getFuturePicks(cards: DailyCard[], now = new Date()) {
  return flattenDailyCards(cards, now).filter((pick) => !pick.hasStarted && pick.result === "pending");
}

export function formatPickTimestamp(timestamp: string) {
  return toEasternDateLabel(new Date(timestamp));
}
