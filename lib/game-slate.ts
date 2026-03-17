const EASTERN_TIMEZONE = "America/New_York";

export const SUPPORTED_USER_BET_LEAGUES = ["NBA", "NCAA", "NHL"] as const;

export type SupportedUserBetLeague = (typeof SUPPORTED_USER_BET_LEAGUES)[number];

type EspnScoreboardResponse = {
  events?: EspnEvent[];
};

type EspnEvent = {
  id?: string;
  date?: string;
  status?: {
    type?: {
      completed?: boolean;
      state?: string;
      description?: string;
    };
  };
  competitions?: Array<{
    competitors?: Array<{
      homeAway?: "home" | "away";
      score?: string;
      team?: {
        displayName?: string;
        shortDisplayName?: string;
      };
    }>;
  }>;
};

export type SlateGame = {
  id: string;
  date: string;
  sport: string;
  league: SupportedUserBetLeague;
  event: string;
  awayTeam: string;
  homeTeam: string;
  eventStartAt: string;
  startTime: string;
  status: "upcoming" | "live" | "final";
  statusLabel: string;
  awayScore: number | null;
  homeScore: number | null;
};

function formatEspnDate(isoDate: string) {
  return isoDate.replace(/-/g, "");
}

function formatStartTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function parseScore(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getLeagueConfig(league: string) {
  const normalized = league.toUpperCase();

  if (normalized === "NBA") {
    return {
      league: "NBA" as const,
      sport: "Basketball",
      path: "basketball/nba"
    };
  }

  if (normalized === "NCAA" || normalized === "NCAAB") {
    return {
      league: "NCAA" as const,
      sport: "Basketball",
      path: "basketball/mens-college-basketball"
    };
  }

  if (normalized === "NHL") {
    return {
      league: "NHL" as const,
      sport: "Hockey",
      path: "hockey/nhl"
    };
  }

  return null;
}

function mapEventToSlateGame(event: EspnEvent, isoDate: string, config: NonNullable<ReturnType<typeof getLeagueConfig>>): SlateGame | null {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];
  const away = competitors.find((competitor) => competitor.homeAway === "away");
  const home = competitors.find((competitor) => competitor.homeAway === "home");

  const awayTeam = away?.team?.shortDisplayName || away?.team?.displayName;
  const homeTeam = home?.team?.shortDisplayName || home?.team?.displayName;

  if (!event.id || !event.date || !awayTeam || !homeTeam) {
    return null;
  }

  const completed = Boolean(event.status?.type?.completed);
  const state = event.status?.type?.state || "pre";
  const status = completed ? "final" : state === "in" ? "live" : "upcoming";

  return {
    id: event.id,
    date: isoDate,
    sport: config.sport,
    league: config.league,
    event: `${awayTeam} @ ${homeTeam}`,
    awayTeam,
    homeTeam,
    eventStartAt: event.date,
    startTime: `${formatStartTime(event.date)} ET`,
    status,
    statusLabel: completed ? "Final" : state === "in" ? "Live" : "Upcoming",
    awayScore: parseScore(away?.score),
    homeScore: parseScore(home?.score)
  };
}

export async function getSlateForLeagueDate(league: string, isoDate: string) {
  const config = getLeagueConfig(league);

  if (!config) {
    return [] as SlateGame[];
  }

  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/${config.path}/scoreboard?dates=${formatEspnDate(isoDate)}`,
    {
      next: {
        revalidate: 300
      }
    }
  );

  if (!response.ok) {
    return [] as SlateGame[];
  }

  const payload = (await response.json()) as EspnScoreboardResponse;

  return (payload.events || [])
    .map((event) => mapEventToSlateGame(event, isoDate, config))
    .filter((event): event is SlateGame => Boolean(event))
    .sort((left, right) => new Date(left.eventStartAt).getTime() - new Date(right.eventStartAt).getTime());
}
