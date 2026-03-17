import { NextResponse } from "next/server";
import { isAuthorizedAutomationRequest, runDailyCardAutomation, shouldRunNow } from "@/lib/picks-automation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorizedAutomationRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";

  if (!force && !shouldRunNow()) {
    return NextResponse.json({
      ok: true,
      status: "skipped",
      reason: "Outside the midnight America/New_York publish window."
    });
  }

  try {
    const result = await runDailyCardAutomation();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Automation failed"
      },
      { status: 500 }
    );
  }
}
