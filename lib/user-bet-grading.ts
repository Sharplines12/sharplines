import { calculateProfitLoss } from "@/lib/picks";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { getSlateForLeagueDate, type SlateGame } from "@/lib/game-slate";
import type { PickResult } from "@/lib/data";

type UserBetGradeRow = {
  id: string;
  date: string;
  league: string;
  game: string;
  bet_type: string;
  pick_title: string;
  odds: string;
  units: number;
  result: "win" | "loss" | "push" | "pending";
};

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
    if (!event.includes(separator)) {
      continue;
    }

    const [left, right] = event.split(separator).map((part) => part.trim());

    if (left && right) {
      return { left, right };
    }
  }

  return null;
}

function extractNumericValue(value: string) {
  const match = value.match(/([+-]?\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveTeamSide(selection: string, game: SlateGame) {
  const normalizedSelection = normalizeText(selection);
  const normalizedAway = normalizeText(game.awayTeam);
  const normalizedHome = normalizeText(game.homeTeam);

  if (normalizedSelection && (normalizedAway.includes(normalizedSelection) || normalizedSelection.includes(normalizedAway))) {
    return "away" as const;
  }

  if (normalizedSelection && (normalizedHome.includes(normalizedSelection) || normalizedSelection.includes(normalizedHome))) {
    return "home" as const;
  }

  return null;
}

function parseSpreadSelection(bet: UserBetGradeRow, game: SlateGame) {
  const handicap = extractNumericValue(bet.pick_title);

  if (handicap === null) {
    return null;
  }

  const selection = bet.pick_title.replace(/([+-]?\d+(?:\.\d+)?)/, "").trim();
  const side = resolveTeamSide(selection, game);

  if (!side) {
    return null;
  }

  return {
    side,
    handicap
  };
}

function parseMoneylineSelection(bet: UserBetGradeRow, game: SlateGame) {
  const side = resolveTeamSide(bet.pick_title, game);
  return side ? { side } : null;
}

function parseTotalSelection(bet: UserBetGradeRow) {
  const directionMatch = bet.pick_title.match(/\b(over|under)\b/i);
  const total = extractNumericValue(bet.pick_title);

  if (!directionMatch || total === null) {
    return null;
  }

  return {
    direction: directionMatch[1].toLowerCase() as "over" | "under",
    total: Math.abs(total)
  };
}

function findMatchingGame(bet: UserBetGradeRow, slate: SlateGame[]) {
  const parsed = parseEventTeams(bet.game);

  if (!parsed) {
    return null;
  }

  const left = normalizeText(parsed.left);
  const right = normalizeText(parsed.right);

  return (
    slate.find((game) => {
      const away = normalizeText(game.awayTeam);
      const home = normalizeText(game.homeTeam);

      return (left === away && right === home) || (left === home && right === away);
    }) || null
  );
}

function gradeBetFromGame(
  bet: UserBetGradeRow,
  game: SlateGame
): {
  result: PickResult;
  supported: boolean;
} {
  if (game.status !== "final" || game.awayScore === null || game.homeScore === null) {
    return {
      result: "pending" as const,
      supported: false
    };
  }

  const betType = bet.bet_type.toLowerCase();

  if (betType.includes("moneyline")) {
    const selection = parseMoneylineSelection(bet, game);

    if (!selection) {
      return {
        result: "pending" as const,
        supported: false
      };
    }

    const selectedScore = selection.side === "away" ? game.awayScore : game.homeScore;
    const otherScore = selection.side === "away" ? game.homeScore : game.awayScore;

    return {
      result: selectedScore > otherScore ? "win" : selectedScore < otherScore ? "loss" : "push",
      supported: true
    };
  }

  if (betType.includes("spread")) {
    const selection = parseSpreadSelection(bet, game);

    if (!selection) {
      return {
        result: "pending" as const,
        supported: false
      };
    }

    const selectedScore = selection.side === "away" ? game.awayScore : game.homeScore;
    const otherScore = selection.side === "away" ? game.homeScore : game.awayScore;
    const margin = selectedScore + selection.handicap - otherScore;

    return {
      result: margin > 0 ? "win" : margin < 0 ? "loss" : "push",
      supported: true
    };
  }

  if (betType.includes("total")) {
    const selection = parseTotalSelection(bet);

    if (!selection) {
      return {
        result: "pending" as const,
        supported: false
      };
    }

    const total = game.awayScore + game.homeScore;

    return {
      result:
        total === selection.total
          ? "push"
          : selection.direction === "over"
            ? total > selection.total
              ? "win"
              : "loss"
            : total < selection.total
              ? "win"
              : "loss",
      supported: true
    };
  }

  return {
    result: "pending" as const,
    supported: false
  };
}

export async function gradePendingUserBets(todayIsoDate: string) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      checked: 0,
      updated: 0
    };
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("user_bets")
    .select("id, date, league, game, bet_type, pick_title, odds, units, result")
    .eq("result", "pending")
    .lt("date", todayIsoDate)
    .order("date", { ascending: false });

  if (error || !data?.length) {
    return {
      checked: 0,
      updated: 0
    };
  }

  const bets = data as UserBetGradeRow[];
  const slateCache = new Map<string, SlateGame[]>();
  let updated = 0;

  for (const bet of bets) {
    const cacheKey = `${bet.league}:${bet.date}`;

    if (!slateCache.has(cacheKey)) {
      slateCache.set(cacheKey, await getSlateForLeagueDate(bet.league, bet.date));
    }

    const slate = slateCache.get(cacheKey) || [];
    const matchedGame = findMatchingGame(bet, slate);

    if (!matchedGame) {
      continue;
    }

    const graded = gradeBetFromGame(bet, matchedGame);

    if (!graded.supported || graded.result === "pending") {
      continue;
    }

    const { error: updateError } = await supabase
      .from("user_bets")
      .update({
        result: graded.result,
        profit_loss: calculateProfitLoss(graded.result, bet.odds, Number(bet.units || 1)),
        settled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", bet.id);

    if (!updateError) {
      updated += 1;
    }
  }

  return {
    checked: bets.length,
    updated
  };
}
