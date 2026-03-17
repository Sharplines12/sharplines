import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSlateForLeagueDate, SUPPORTED_USER_BET_LEAGUES } from "@/lib/game-slate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const league = String(url.searchParams.get("league") || "").trim().toUpperCase();
  const date = String(url.searchParams.get("date") || "").trim();

  if (!SUPPORTED_USER_BET_LEAGUES.includes(league as (typeof SUPPORTED_USER_BET_LEAGUES)[number])) {
    return NextResponse.json({ error: "Unsupported league." }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const games = await getSlateForLeagueDate(league, date);
  return NextResponse.json({ games });
}
