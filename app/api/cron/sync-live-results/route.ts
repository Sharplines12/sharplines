import { NextResponse } from "next/server";
import { getDailyCards } from "@/lib/content";
import { flattenDailyCards } from "@/lib/picks";
import { isAuthorizedAutomationRequest } from "@/lib/picks-automation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorizedAutomationRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cards = await getDailyCards();
    const picks = flattenDailyCards(cards);

    return NextResponse.json({
      ok: true,
      status: "synced",
      counts: {
        total: picks.length,
        upcoming: picks.filter((pick) => pick.liveStatus === "upcoming").length,
        live: picks.filter((pick) => pick.liveStatus === "live").length,
        final: picks.filter((pick) => pick.liveStatus === "final").length,
        pendingResults: picks.filter((pick) => pick.result === "pending").length,
        settledResults: picks.filter((pick) => pick.result !== "pending").length
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Live sync failed"
      },
      { status: 500 }
    );
  }
}
