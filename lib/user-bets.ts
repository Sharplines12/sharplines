import { revalidatePath } from "next/cache";
import { calculateProfitLoss } from "@/lib/picks";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import type { UserBet } from "@/lib/data";

type DbUserBet = {
  id: string;
  user_id: string;
  date: string;
  sport: string;
  league: string;
  game: string;
  bet_type: string;
  pick_title: string;
  sportsbook: string;
  odds: string;
  stake: number;
  units: number;
  result: UserBet["result"];
  profit_loss: number;
  notes: string;
  created_at: string;
  updated_at: string;
  settled_at: string | null;
};

export type UserBetInput = {
  id?: string;
  date: string;
  sport: string;
  league: string;
  event: string;
  betType: string;
  pickTitle: string;
  sportsbook: string;
  odds: string;
  stake: number;
  units: number;
  result: UserBet["result"];
  notes: string;
};

// Future hook: this input shape can be reused by CSV import jobs or sportsbook-partner sync jobs
// once Sharplines has explicit user permission and a real ingestion pipeline.

const fallbackUserBets: UserBet[] = [
  {
    id: "sample-user-bet-1",
    userId: "demo-user",
    date: "2026-03-14",
    sport: "Basketball",
    league: "NBA",
    event: "Lakers vs. Suns",
    betType: "Total",
    pickTitle: "Over 231.5",
    sportsbook: "FanDuel",
    odds: "-110",
    stake: 55,
    units: 1,
    result: "loss",
    profitLoss: -1,
    notes: "Tracked manually to compare against the Sharplines card.",
    createdAt: "2026-03-14T18:00:00.000Z",
    updatedAt: "2026-03-15T02:10:00.000Z",
    settledAt: "2026-03-15T02:10:00.000Z"
  },
  {
    id: "sample-user-bet-2",
    userId: "demo-user",
    date: "2026-03-15",
    sport: "Basketball",
    league: "NCAA",
    event: "Houston vs. Iowa State",
    betType: "First Half",
    pickTitle: "Houston -2.5",
    sportsbook: "DraftKings",
    odds: "+100",
    stake: 50,
    units: 1,
    result: "win",
    profitLoss: 1,
    notes: "Good example of comparing your card to Sharplines' archive.",
    createdAt: "2026-03-15T15:00:00.000Z",
    updatedAt: "2026-03-15T21:40:00.000Z",
    settledAt: "2026-03-15T21:40:00.000Z"
  }
];

function mapUserBet(row: DbUserBet): UserBet {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    sport: row.sport,
    league: row.league,
    event: row.game,
    betType: row.bet_type,
    pickTitle: row.pick_title,
    sportsbook: row.sportsbook,
    odds: row.odds,
    stake: row.stake,
    units: row.units,
    result: row.result,
    profitLoss: row.profit_loss,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    settledAt: row.settled_at
  };
}

function validateUserBet(input: UserBetInput) {
  if (!input.date || !input.sport || !input.league || !input.event || !input.betType || !input.pickTitle || !input.odds) {
    throw new Error("Add the date, sport, league, event, bet type, pick title, and odds.");
  }
}

export async function getUserBets(userId: string) {
  if (!userId) {
    return [] as UserBet[];
  }

  if (!isSupabaseConfigured()) {
    return fallbackUserBets;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("user_bets")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data as DbUserBet[]).map(mapUserBet);
  } catch {
    return [];
  }
}

export async function saveUserBet(userId: string, input: UserBetInput) {
  validateUserBet(input);

  if (!isSupabaseConfigured()) {
    throw new Error("Bet tracking needs the live database connection to be available.");
  }

  const supabase = await createSupabaseServerClient();
  const profitLoss = calculateProfitLoss(input.result, input.odds, input.units);
  const payload = {
    id: input.id,
    user_id: userId,
    date: input.date,
    sport: input.sport,
    league: input.league,
    game: input.event,
    bet_type: input.betType,
    pick_title: input.pickTitle,
    sportsbook: input.sportsbook,
    odds: input.odds,
    stake: input.stake,
    units: input.units,
    result: input.result,
    profit_loss: profitLoss,
    notes: input.notes,
    updated_at: new Date().toISOString(),
    settled_at: input.result === "pending" ? null : new Date().toISOString()
  };

  const query = input.id
    ? supabase.from("user_bets").update(payload).eq("id", input.id).eq("user_id", userId)
    : supabase.from("user_bets").insert(payload);
  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-bets");
  revalidatePath("/dashboard/compare");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/history");
}

export async function deleteUserBet(userId: string, betId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Bet tracking needs the live database connection to be available.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("user_bets").delete().eq("id", betId).eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-bets");
  revalidatePath("/dashboard/compare");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/history");
}
