import type { DailyCard } from "@/lib/data";

export function getNewYorkIsoDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

export function isCurrentDailyCard(card: DailyCard, now = new Date()) {
  const cardDate = card.picks[0]?.date;
  return Boolean(cardDate && cardDate === getNewYorkIsoDate(now));
}
