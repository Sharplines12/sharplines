/**
 * Supported leagues for user bet tracking
 */
export type SupportedUserBetLeague = "NBA" | "NCAA" | "NHL";

/**
 * Represents a game in the slate with team information and scores
 */
export type SlateGame = {
  awayTeam: string;
  homeTeam: string;
  awayScore: number | null;
  homeScore: number | null;
  status: "scheduled" | "in_progress" | "final";
};

/**
 * Retrieves the game slate for a specific league and date
 * @param league The league to get the slate for
 * @param date The date in ISO format (YYYY-MM-DD)
 * @returns Array of games for that league and date
 */
export async function getSlateForLeagueDate(
  league: string,
  date: string
): Promise<SlateGame[]> {
  // This function would normally fetch from an external sports data API
  // For now, return an empty array as a placeholder
  return [];
}
