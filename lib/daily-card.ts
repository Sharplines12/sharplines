import type { DailyCard } from "@/lib/data";

/**
 * Checks if a daily card is for the current date
 * @param card The daily card to check
 * @returns true if the card's date matches today's date
 */
export function isCurrentDailyCard(card: DailyCard | null): boolean {
  if (!card) {
    return false;
  }

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];
  const cardDateString = card.date.split("T")[0];

  return cardDateString === todayDateString;
}
