import { logPickChanges } from "@/lib/pick-change-log";
import { calculateProfitLoss, parsePickStart } from "@/lib/picks";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import type { DailyCard, PickEntry, PickLiveStatus, PickResult, PickScoreboard } from "@/lib/data";

type OddsApiScoreEvent = {
  id: string;
  sport_key: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }> | null;
  last_update: string | null;
};

type LivePickResolution = {
  liveStatus: PickLiveStatus;
  scoreboard: PickScoreboard | null;
  gameDetail: string | null;
  eventStartAt: string | null;
  liveUpdatedAt: string | null;
  liveDataSource: string | null;
  autoGradingSupported: boolean;
};

type GradingDecision = {
  result: PickResult;
  supported: boolean;
  reason: string;
};

type PickDbUpdate = {
  pickId: string;
  nextValues: Record<string, unknown>;
  oldValues: Record<string, unknown>;
  changeSummary: string;
};

const LIVE_PROVIDER_NAME = "The Odds API";
const EASTERN_TIMEZONE = "America/New_York";
const LIVE_RESULTS_REVALIDATE_SECONDS = 60;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\bsaint\b/g, "st")
    .replace(/\bst\.\b/g, "st")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function parseEventTeams(event: string) {
  const separators = [" vs. ", " vs ", " @ ", " at "];

  for (const separator of separators) {
    if (event.includes(separator)) {
      const [left, right] = event.split(separator).map((part) => part.trim());

      if (left && right) {
        return {
          left,
          right
        };
      }
    }
  }

  return null;
}

function scoreLookup(event: OddsApiScoreEvent) {
  const scores = event.scores || [];
  const findScore = (team: string) => {
    const item = scores.find((entry) => normalizeText(entry.name) === normalizeText(team));
    const parsed = item ? Number(item.score) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    awayScore: findScore(event.away_team),
    homeScore: findScore(event.home_team)
  };
}

function formatScoreSummary(event: OddsApiScoreEvent) {
  const { awayScore, homeScore } = scoreLookup(event);

  if (awayScore === null || homeScore === null) {
    return `${event.away_team} at ${event.home_team}`;
  }

  return `${event.away_team} ${awayScore} - ${homeScore} ${event.home_team}`;
}

function formatEasternTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function buildGameDetail(event: OddsApiScoreEvent, liveStatus: PickLiveStatus) {
  if (liveStatus === "upcoming") {
    return `Starts ${formatEasternTime(event.commence_time)} ET`;
  }

  if (liveStatus === "live") {
    return event.last_update ? `Live • Updated ${formatEasternTime(event.last_update)} ET` : "Live";
  }

  if (event.last_update) {
    return `Final • Updated ${formatEasternTime(event.last_update)} ET`;
  }

  return "Final";
}

function getProviderSportKey(pick: PickEntry) {
  const league = pick.league.toLowerCase();
  const sport = pick.sport.toLowerCase();

  if (league.includes("nba")) {
    return "basketball_nba";
  }

  if (league.includes("ncaa") || league.includes("ncaab")) {
    return "basketball_ncaab";
  }

  if (league.includes("nhl")) {
    return "icehockey_nhl";
  }

  if (league.includes("nfl")) {
    return "americanfootball_nfl";
  }

  if (league.includes("mlb")) {
    return "baseball_mlb";
  }

  if (sport.includes("basketball")) {
    return "basketball_nba";
  }

  if (sport.includes("hockey")) {
    return "icehockey_nhl";
  }

  if (sport.includes("football")) {
    return "americanfootball_nfl";
  }

  if (sport.includes("baseball")) {
    return "baseball_mlb";
  }

  return null;
}

function deriveFallbackLiveStatus(pick: PickEntry, now = new Date()): PickLiveStatus {
  if (pick.result !== "pending") {
    return "final";
  }

  const parsedStart = parsePickStart(pick.date, pick.startTime);

  if (!parsedStart) {
    return "upcoming";
  }

  return parsedStart.getTime() > now.getTime() ? "upcoming" : "live";
}

async function fetchScoreboardForSport(sportKey: string) {
  const apiKey = process.env.SPORTS_DATA_API_KEY;

  if (!apiKey) {
    return [] as OddsApiScoreEvent[];
  }

  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?daysFrom=3&apiKey=${encodeURIComponent(apiKey)}`,
    {
      next: {
        revalidate: LIVE_RESULTS_REVALIDATE_SECONDS
      }
    }
  );

  if (!response.ok) {
    return [] as OddsApiScoreEvent[];
  }

  return (await response.json()) as OddsApiScoreEvent[];
}

async function fetchScoreboards(picks: PickEntry[]) {
  const sportKeys = Array.from(new Set(picks.map(getProviderSportKey).filter(Boolean))) as string[];

  if (!sportKeys.length) {
    return new Map<string, OddsApiScoreEvent[]>();
  }

  const results = await Promise.all(sportKeys.map(async (sportKey) => [sportKey, await fetchScoreboardForSport(sportKey)] as const));

  return new Map(results);
}

function teamsMatch(left: string, right: string, event: OddsApiScoreEvent) {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);
  const normalizedAway = normalizeText(event.away_team);
  const normalizedHome = normalizeText(event.home_team);

  return (
    (normalizedLeft === normalizedAway && normalizedRight === normalizedHome) ||
    (normalizedLeft === normalizedHome && normalizedRight === normalizedAway)
  );
}

function findMatchingEvent(pick: PickEntry, scoreboards: Map<string, OddsApiScoreEvent[]>) {
  const sportKey = getProviderSportKey(pick);
  const parsedTeams = parseEventTeams(pick.event);

  if (!sportKey || !parsedTeams) {
    return null;
  }

  const events = scoreboards.get(sportKey) || [];
  const pickStart = parsePickStart(pick.date, pick.startTime)?.getTime();

  const matches = events.filter((event) => {
    if (!teamsMatch(parsedTeams.left, parsedTeams.right, event)) {
      return false;
    }

    if (!pickStart) {
      return true;
    }

    const eventStart = new Date(event.commence_time).getTime();
    return Math.abs(eventStart - pickStart) <= 12 * 60 * 60 * 1000;
  });

  return matches[0] || null;
}

function buildScoreboard(event: OddsApiScoreEvent): PickScoreboard {
  const { awayScore, homeScore } = scoreLookup(event);

  return {
    awayTeam: event.away_team,
    homeTeam: event.home_team,
    awayScore,
    homeScore,
    summary: formatScoreSummary(event)
  };
}

function resolveLiveState(pick: PickEntry, matchedEvent: OddsApiScoreEvent | null, now = new Date()): LivePickResolution {
  if (!matchedEvent) {
    return {
      liveStatus: deriveFallbackLiveStatus(pick, now),
      scoreboard: null,
      gameDetail: null,
      eventStartAt: parsePickStart(pick.date, pick.startTime)?.toISOString() ?? null,
      liveUpdatedAt: null,
      liveDataSource: null,
      autoGradingSupported: false
    };
  }

  const scoreboard = buildScoreboard(matchedEvent);
  const eventStartAt = matchedEvent.commence_time;
  const liveStatus: PickLiveStatus = matchedEvent.completed
    ? "final"
    : new Date(matchedEvent.commence_time).getTime() <= now.getTime()
      ? "live"
      : "upcoming";

  return {
    liveStatus,
    scoreboard,
    gameDetail: buildGameDetail(matchedEvent, liveStatus),
    eventStartAt,
    liveUpdatedAt: matchedEvent.last_update,
    liveDataSource: LIVE_PROVIDER_NAME,
    autoGradingSupported: canAutoGradePick(pick)
  };
}

function extractNumericValue(value: string) {
  const match = value.match(/([+-]?\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveTeamSide(selection: string, event: OddsApiScoreEvent) {
  const normalizedSelection = normalizeText(selection);
  const away = normalizeText(event.away_team);
  const home = normalizeText(event.home_team);

  if (normalizedSelection && (away.includes(normalizedSelection) || normalizedSelection.includes(away))) {
    return "away" as const;
  }

  if (normalizedSelection && (home.includes(normalizedSelection) || normalizedSelection.includes(home))) {
    return "home" as const;
  }

  return null;
}

function parseSpreadSelection(pick: PickEntry, event: OddsApiScoreEvent) {
  const handicap = extractNumericValue(pick.line);

  if (handicap === null) {
    return null;
  }

  const selection = pick.line.replace(/([+-]?\d+(?:\.\d+)?)/, "").trim();
  const side = resolveTeamSide(selection || pick.pickTitle, event);

  if (!side) {
    return null;
  }

  return {
    side,
    handicap
  };
}

function parseMoneylineSelection(pick: PickEntry, event: OddsApiScoreEvent) {
  const side = resolveTeamSide(pick.line || pick.pickTitle, event) ?? resolveTeamSide(pick.pickTitle, event);
  return side ? { side } : null;
}

function parseTotalSelection(pick: PickEntry) {
  const source = `${pick.line} ${pick.pickTitle}`;
  const directionMatch = source.match(/\b(over|under)\b/i);
  const total = extractNumericValue(source);

  if (!directionMatch || total === null) {
    return null;
  }

  return {
    direction: directionMatch[1].toLowerCase() as "over" | "under",
    total: Math.abs(total)
  };
}

function canAutoGradePick(pick: PickEntry) {
  const betType = pick.betType.toLowerCase();
  const market = pick.market.toLowerCase();
  const line = pick.line.toLowerCase();

  if (betType.includes("moneyline") || market.includes("moneyline")) {
    return true;
  }

  if (
    betType.includes("spread") ||
    market.includes("spread") ||
    market.includes("run line") ||
    market.includes("puck line")
  ) {
    return true;
  }

  if (betType.includes("total") || market.includes("total") || line.includes("over") || line.includes("under")) {
    return true;
  }

  return false;
}

function gradePickFromFinalScore(pick: PickEntry, event: OddsApiScoreEvent): GradingDecision {
  const { awayScore, homeScore } = scoreLookup(event);

  if (awayScore === null || homeScore === null) {
    return {
      result: "pending",
      supported: false,
      reason: "Final score data was incomplete."
    };
  }

  const betType = pick.betType.toLowerCase();
  const market = pick.market.toLowerCase();

  if (betType.includes("moneyline") || market.includes("moneyline")) {
    const selection = parseMoneylineSelection(pick, event);

    if (!selection) {
      return {
        result: "pending",
        supported: false,
        reason: "Could not identify the moneyline side from the published pick."
      };
    }

    const selectedScore = selection.side === "away" ? awayScore : homeScore;
    const otherScore = selection.side === "away" ? homeScore : awayScore;

    if (selectedScore === otherScore) {
      return {
        result: "push",
        supported: true,
        reason: "Moneyline landed on a draw."
      };
    }

    return {
      result: selectedScore > otherScore ? "win" : "loss",
      supported: true,
      reason: "Moneyline graded from the final scoreboard."
    };
  }

  if (
    betType.includes("spread") ||
    market.includes("spread") ||
    market.includes("run line") ||
    market.includes("puck line")
  ) {
    const selection = parseSpreadSelection(pick, event);

    if (!selection) {
      return {
        result: "pending",
        supported: false,
        reason: "Could not parse the spread selection from the published line."
      };
    }

    const selectedScore = selection.side === "away" ? awayScore : homeScore;
    const otherScore = selection.side === "away" ? homeScore : awayScore;
    const margin = selectedScore + selection.handicap - otherScore;

    return {
      result: margin > 0 ? "win" : margin < 0 ? "loss" : "push",
      supported: true,
      reason: "Spread graded from the final scoreboard."
    };
  }

  if (betType.includes("total") || market.includes("total") || pick.line.toLowerCase().includes("over") || pick.line.toLowerCase().includes("under")) {
    const totalSelection = parseTotalSelection(pick);

    if (!totalSelection) {
      return {
        result: "pending",
        supported: false,
        reason: "Could not parse the posted total from the published line."
      };
    }

    const gameTotal = awayScore + homeScore;

    if (gameTotal === totalSelection.total) {
      return {
        result: "push",
        supported: true,
        reason: "Total landed exactly on the posted number."
      };
    }

    return {
      result:
        totalSelection.direction === "over"
          ? gameTotal > totalSelection.total
            ? "win"
            : "loss"
          : gameTotal < totalSelection.total
            ? "win"
            : "loss",
      supported: true,
      reason: "Total graded from the final scoreboard."
    };
  }

  return {
    result: "pending",
    supported: false,
    reason: "This market still needs manual or richer-stat grading."
  };
}

async function persistPickUpdates(updates: PickDbUpdate[]) {
  if (!updates.length || !isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const supabase = createSupabaseServiceClient();

  for (const update of updates) {
    await supabase.from("picks").update(update.nextValues).eq("id", update.pickId);
  }

  await logPickChanges(
    updates.map((update) => ({
      pickId: update.pickId,
      changedBy: "live-results",
      changeSummary: update.changeSummary,
      oldValues: update.oldValues,
      newValues: update.nextValues
    }))
  );
}

function buildPickUpdate(pick: PickEntry, liveState: LivePickResolution, event: OddsApiScoreEvent | null): PickDbUpdate | null {
  const baseOldValues = {
    result: pick.result,
    closing_status: pick.closingStatus,
    settled_at: pick.settledAt,
    profit_loss: pick.profitLoss
  };

  if (!event) {
    return null;
  }

  if (liveState.liveStatus === "live" && pick.closingStatus !== "started" && pick.result === "pending") {
    return {
      pickId: pick.id,
      oldValues: baseOldValues,
      nextValues: {
        closing_status: "started",
        updated_at: event.last_update || new Date().toISOString()
      },
      changeSummary: "Live results sync marked the pick as in progress."
    };
  }

  if (liveState.liveStatus !== "final") {
    return null;
  }

  if (pick.result !== "pending" && pick.closingStatus !== "settled") {
    return {
      pickId: pick.id,
      oldValues: baseOldValues,
      nextValues: {
        closing_status: "settled",
        updated_at: event.last_update || new Date().toISOString(),
        settled_at: pick.settledAt || event.last_update || new Date().toISOString()
      },
      changeSummary: "Live results sync aligned a graded pick with final game status."
    };
  }

  if (pick.result !== "pending") {
    return null;
  }

  const grading = gradePickFromFinalScore(pick, event);

  if (!grading.supported || grading.result === "pending") {
    return null;
  }

  return {
    pickId: pick.id,
    oldValues: baseOldValues,
    nextValues: {
      result: grading.result,
      settled_at: event.last_update || new Date().toISOString(),
      updated_at: event.last_update || new Date().toISOString(),
      closing_status: "settled",
      profit_loss: calculateProfitLoss(grading.result, pick.odds, pick.units)
    },
    changeSummary: `Live results sync auto-graded the pick as ${grading.result}. ${grading.reason}`
  };
}

export async function enrichDailyCardsWithLiveResults(cards: DailyCard[]) {
  if (!cards.length) {
    return cards;
  }

  const picks = cards.flatMap((card) => card.picks);
  const scoreboards = await fetchScoreboards(picks);
  const updates: PickDbUpdate[] = [];

  const nextCards = cards.map((card) => ({
    ...card,
    picks: card.picks.map((pick) => {
      const matchedEvent = findMatchingEvent(pick, scoreboards);
      const liveState = resolveLiveState(pick, matchedEvent);
      const pendingUpdate = buildPickUpdate(pick, liveState, matchedEvent);

      if (pendingUpdate) {
        updates.push(pendingUpdate);
      }

      const nextResult =
        pendingUpdate && typeof pendingUpdate.nextValues.result === "string"
          ? (pendingUpdate.nextValues.result as PickResult)
          : pick.result;
      const nextProfitLoss =
        pendingUpdate && typeof pendingUpdate.nextValues.profit_loss === "number"
          ? (pendingUpdate.nextValues.profit_loss as number)
          : pick.profitLoss;
      const nextSettledAt =
        pendingUpdate && typeof pendingUpdate.nextValues.settled_at === "string"
          ? (pendingUpdate.nextValues.settled_at as string)
          : pick.settledAt;
      const nextClosingStatus =
        pendingUpdate && typeof pendingUpdate.nextValues.closing_status === "string"
          ? (pendingUpdate.nextValues.closing_status as PickEntry["closingStatus"])
          : pick.closingStatus;

      return {
        ...pick,
        result: nextResult,
        profitLoss: nextProfitLoss,
        settledAt: nextSettledAt,
        updatedAt:
          pendingUpdate && typeof pendingUpdate.nextValues.updated_at === "string"
            ? (pendingUpdate.nextValues.updated_at as string)
            : pick.updatedAt,
        closingStatus: nextClosingStatus,
        liveStatus: liveState.liveStatus,
        scoreboard: liveState.scoreboard,
        gameDetail: liveState.gameDetail,
        eventStartAt: liveState.eventStartAt,
        liveUpdatedAt: liveState.liveUpdatedAt,
        liveDataSource: liveState.liveDataSource,
        autoGradingSupported: liveState.autoGradingSupported
      };
    })
  }));

  await persistPickUpdates(
    Array.from(new Map(updates.map((update) => [`${update.pickId}-${JSON.stringify(update.nextValues)}`, update])).values())
  );

  return nextCards;
}
