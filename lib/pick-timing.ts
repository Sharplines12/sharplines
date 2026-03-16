import type { DailyCard, PickEntry } from "@/lib/data";

const monthIndex: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function parseDateLabel(dateLabel: string): DateParts {
  const match = dateLabel.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);

  if (!match) {
    throw new Error(`Unsupported date label: ${dateLabel}`);
  }

  const [, monthName, day, year] = match;

  return {
    year: Number(year),
    month: monthIndex[monthName],
    day: Number(day)
  };
}

function compareDateParts(a: DateParts, b: DateParts) {
  if (a.year !== b.year) {
    return a.year - b.year;
  }

  if (a.month !== b.month) {
    return a.month - b.month;
  }

  return a.day - b.day;
}

function getEasternNowParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);

  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    date: parseDateLabel(`${partMap.month} ${partMap.day}, ${partMap.year}`),
    minutes: Number(partMap.hour) * 60 + Number(partMap.minute)
  };
}

function parseStartTimeToMinutes(startTime: string) {
  const match = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [, hourText, minuteText, meridiem] = match;
  let hour = Number(hourText) % 12;

  if (meridiem.toUpperCase() === "PM") {
    hour += 12;
  }

  return hour * 60 + Number(minuteText);
}

export function isArchivedPick(cardDateLabel: string, pick: PickEntry, now = new Date()) {
  if (pick.result !== "pending") {
    return true;
  }

  const cardDate = parseDateLabel(cardDateLabel);
  const currentEastern = getEasternNowParts(now);
  const dateComparison = compareDateParts(cardDate, currentEastern.date);

  if (dateComparison < 0) {
    return true;
  }

  if (dateComparison > 0) {
    return false;
  }

  return parseStartTimeToMinutes(pick.startTime) <= currentEastern.minutes;
}

export function splitCardPicks(card: DailyCard, sport: string, freePreviewCount: number, now = new Date()) {
  const filteredPicks = card.picks.filter((pick) => sport === "All sports" || pick.sport === sport);
  const upcomingPicks = filteredPicks.filter((pick) => !isArchivedPick(card.date, pick, now));
  const archivedPicks = filteredPicks.filter((pick) => isArchivedPick(card.date, pick, now));

  return {
    filteredPicks,
    upcomingPicks,
    archivedPicks,
    freeUpcomingPicks: upcomingPicks.slice(0, freePreviewCount),
    lockedUpcomingPicks: upcomingPicks.slice(freePreviewCount),
    bestUpcomingPick: upcomingPicks.find((pick) => pick.isBestBet) ?? upcomingPicks[0] ?? null,
    bestAvailablePick:
      upcomingPicks.find((pick) => pick.isBestBet) ??
      upcomingPicks[0] ??
      archivedPicks.find((pick) => pick.isBestBet) ??
      archivedPicks[0] ??
      null
  };
}
