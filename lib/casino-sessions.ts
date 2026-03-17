import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import type { CasinoSession } from "@/lib/data";

type DbCasinoSession = {
  id: string;
  user_id: string;
  date: string;
  casino_name: string;
  game_type: string;
  buy_in: number;
  cash_out: number;
  profit_loss: number;
  session_length: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CasinoSessionInput = {
  id?: string;
  date: string;
  casinoName: string;
  gameType: string;
  buyIn: number;
  cashOut: number;
  sessionLength?: string;
  notes: string;
};

const fallbackCasinoSessions: CasinoSession[] = [
  {
    id: "sample-casino-session-1",
    userId: "demo-user",
    date: "2026-03-09",
    casinoName: "Fanatics Casino",
    gameType: "Blackjack",
    buyIn: 300,
    cashOut: 420,
    profitLoss: 120,
    sessionLength: "1h 20m",
    notes: "Short blackjack session after the sportsbook card. Strong discipline on stop-loss and stop-win points.",
    createdAt: "2026-03-09T20:00:00.000Z",
    updatedAt: "2026-03-09T21:30:00.000Z"
  },
  {
    id: "sample-casino-session-2",
    userId: "demo-user",
    date: "2026-03-12",
    casinoName: "BetMGM Casino",
    gameType: "Slots",
    buyIn: 200,
    cashOut: 110,
    profitLoss: -90,
    sessionLength: "45m",
    notes: "Tracked as a higher-variance slot session. Useful for separating casino bankroll swings from sportsbook results.",
    createdAt: "2026-03-12T23:10:00.000Z",
    updatedAt: "2026-03-12T23:55:00.000Z"
  }
];

function mapCasinoSession(row: DbCasinoSession): CasinoSession {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    casinoName: row.casino_name,
    gameType: row.game_type,
    buyIn: row.buy_in,
    cashOut: row.cash_out,
    profitLoss: row.profit_loss,
    sessionLength: row.session_length,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function validateCasinoSession(input: CasinoSessionInput) {
  if (!input.date || !input.casinoName || !input.gameType) {
    throw new Error("Add the date, casino app, and game type for the session.");
  }
}

function revalidateCasinoRoutes() {
  revalidatePath("/casino");
  revalidatePath("/casino/history");
  revalidatePath("/casino/analytics");
}

export async function getCasinoSessions(userId: string) {
  if (!userId) {
    return [] as CasinoSession[];
  }

  if (!isSupabaseConfigured()) {
    return fallbackCasinoSessions;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("casino_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data as DbCasinoSession[]).map(mapCasinoSession);
  } catch {
    return [];
  }
}

export async function saveCasinoSession(userId: string, input: CasinoSessionInput) {
  validateCasinoSession(input);

  if (!isSupabaseConfigured()) {
    throw new Error("Casino tracking needs the live database connection to be available.");
  }

  const supabase = await createSupabaseServerClient();
  const profitLoss = Number((input.cashOut - input.buyIn).toFixed(2));
  const payload = {
    id: input.id,
    user_id: userId,
    date: input.date,
    casino_name: input.casinoName,
    game_type: input.gameType,
    buy_in: input.buyIn,
    cash_out: input.cashOut,
    profit_loss: profitLoss,
    session_length: input.sessionLength?.trim() || null,
    notes: input.notes,
    updated_at: new Date().toISOString()
  };

  const query = input.id
    ? supabase.from("casino_sessions").update(payload).eq("id", input.id).eq("user_id", userId)
    : supabase.from("casino_sessions").insert(payload);

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  revalidateCasinoRoutes();
}

export async function deleteCasinoSession(userId: string, sessionId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Casino tracking needs the live database connection to be available.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("casino_sessions").delete().eq("id", sessionId).eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCasinoRoutes();
}
