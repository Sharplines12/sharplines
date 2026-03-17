import { randomUUID } from "node:crypto";
import { getApprovedSourceListText, validateSourceNotes } from "@/lib/picks-source-policy";
import { logPickChanges } from "@/lib/pick-change-log";
import { calculateProfitLoss } from "@/lib/picks";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

type GeneratedPick = {
  event: string;
  sport: string;
  league: string;
  pickTitle: string;
  betType: string;
  market: string;
  line: string;
  odds: string;
  sportsbook: string;
  startTime: string;
  confidence: "High" | "Medium" | "Lean";
  units: number;
  shortSummary: string;
  premiumTeaser: string;
  premiumAnalysis: string;
  isBestBet: boolean;
};

type GeneratedCard = {
  status: "publish" | "skip";
  skipReason: string;
  headline: string;
  summary: string;
  premiumIntro: string;
  recordLabel: string;
  sourcingNotes: Array<{
    title: string;
    url: string;
  }>;
  picks: GeneratedPick[];
};

type GradedPick = {
  id: string;
  result: "win" | "loss" | "push" | "pending";
  confidence: "high" | "medium" | "low";
  note: string;
};

type CardValidationResult =
  | {
      ok: true;
      card: GeneratedCard;
      rejectedHosts: string[];
    }
  | {
      ok: false;
      reason: string;
      rejectedHosts: string[];
    };

const APPROVED_SPORTSBOOKS = new Set([
  "FanDuel",
  "DraftKings",
  "BetMGM",
  "Caesars",
  "Fanatics",
  "BetRivers",
  "Hard Rock Bet"
]);

function getOpenAiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  };
}

function getNewYorkParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = Number(get("hour") || "0");

  return {
    isoDate: `${year}-${month}-${day}`,
    displayDate: new Date(`${year}-${month}-${day}T12:00:00Z`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    hour
  };
}

function getOutputText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text) {
    return payload.output_text;
  }

  const contentItems = Array.isArray(payload?.output)
    ? payload.output.flatMap((item: any) => item?.content || [])
    : [];

  const textItem = contentItems.find((item: any) => typeof item?.text === "string");
  return textItem?.text || "";
}

async function openAiJson<T>(params: {
  schemaName: string;
  schema: Record<string, unknown>;
  system: string;
  user: string;
}): Promise<T> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: getOpenAiHeaders(),
    body: JSON.stringify({
      model: process.env.OPENAI_PICKS_MODEL || "gpt-4.1-mini",
      tools: [
        {
          type: "web_search",
          user_location: {
            type: "approximate",
            country: "US"
          }
        }
      ],
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: params.system }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: params.user }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: params.schemaName,
          strict: true,
          schema: params.schema
        }
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const outputText = getOutputText(payload);

  if (!outputText) {
    throw new Error("OpenAI response did not contain output text.");
  }

  return JSON.parse(outputText) as T;
}

function buildRecordLabel(gradedWins: number, gradedLosses: number, gradedPushes: number) {
  const parts = [`${gradedWins}-${gradedLosses}`];

  if (gradedPushes > 0) {
    parts[0] += `-${gradedPushes}`;
  }

  return gradedWins + gradedLosses + gradedPushes > 0 ? `Recent record: ${parts[0]}` : "Fresh AI-generated card";
}

async function gradePendingPicks(todayIsoDate: string) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.OPENAI_API_KEY) {
    return {
      checked: 0,
      updated: 0
    };
  }

  const supabase = createSupabaseServiceClient();
  const { data: pending } = await supabase
    .from("picks")
    .select("id, date, event, market, line, odds, units, result")
    .eq("result", "pending")
    .lt("date", todayIsoDate)
    .order("date", { ascending: false })
    .limit(8);

  if (!pending?.length) {
    return {
      checked: 0,
      updated: 0
    };
  }

  const gradingSchema = {
    type: "object",
    additionalProperties: false,
    required: ["updates"],
    properties: {
      updates: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "result", "confidence", "note"],
          properties: {
            id: { type: "string" },
            result: { type: "string", enum: ["win", "loss", "push", "pending"] },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            note: { type: "string" }
          }
        }
      }
    }
  };

  const graded = await openAiJson<{ updates: GradedPick[] }>({
    schemaName: "grade_pending_picks",
    schema: gradingSchema,
    system:
      "You are grading completed sports betting picks for a public results ledger. Use recent web sources to verify final outcomes. If you cannot verify a result with confidence, leave it as pending. Never guess.",
    user: [
      `Today is ${todayIsoDate}.`,
      "Grade these picks using final game results or final player stat lines:",
      JSON.stringify(pending, null, 2)
    ].join("\n\n")
  });

  const eligibleUpdates = graded.updates.filter((item) => item.result !== "pending" && item.confidence !== "low");

  if (!eligibleUpdates.length) {
    return {
      checked: pending.length,
      updated: 0
    };
  }

  const pendingMap = new Map(pending.map((pick) => [pick.id, pick]));

  await Promise.all(
    eligibleUpdates.map(async (update) => {
      const current = pendingMap.get(update.id);
      const nextValues = {
        result: update.result,
        settled_at: new Date().toISOString(),
        closing_status: "settled",
        profit_loss: calculateProfitLoss(update.result, current?.odds || "-110", Number(current?.units || 1))
      };

      await supabase
        .from("picks")
        .update(nextValues)
        .eq("id", update.id);

      await logPickChanges([
        {
          pickId: update.id,
          changedBy: "automation",
          changeSummary: `Automated grading updated result to ${update.result}.`,
          oldValues: current ? { result: current.result } : null,
          newValues: nextValues
        }
      ]);
    })
  );

  return {
    checked: pending.length,
    updated: eligibleUpdates.length
  };
}

async function generateCard(date: { isoDate: string; displayDate: string }): Promise<GeneratedCard> {
  const sportsFocus = (process.env.PICKS_SPORTS || "NBA,NCAAB,NHL")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const cardSchema = {
    type: "object",
    additionalProperties: false,
    required: [
      "status",
      "skipReason",
      "headline",
      "summary",
      "premiumIntro",
      "recordLabel",
      "sourcingNotes",
      "picks"
    ],
    properties: {
      status: { type: "string", enum: ["publish", "skip"] },
      skipReason: { type: "string" },
      headline: { type: "string" },
      summary: { type: "string" },
      premiumIntro: { type: "string" },
      recordLabel: { type: "string" },
      sourcingNotes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "url"],
          properties: {
            title: { type: "string" },
            url: { type: "string" }
          }
        }
      },
      picks: {
        type: "array",
        minItems: 0,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "event",
            "sport",
            "league",
            "pickTitle",
            "betType",
            "market",
            "line",
            "odds",
            "sportsbook",
            "startTime",
            "confidence",
            "units",
            "shortSummary",
            "premiumTeaser",
            "premiumAnalysis",
            "isBestBet"
          ],
          properties: {
            event: { type: "string" },
            sport: { type: "string" },
            league: { type: "string" },
            pickTitle: { type: "string" },
            betType: { type: "string" },
            market: { type: "string" },
            line: { type: "string" },
            odds: { type: "string" },
            sportsbook: { type: "string" },
            startTime: { type: "string" },
            confidence: { type: "string", enum: ["High", "Medium", "Lean"] },
            units: { type: "number" },
            shortSummary: { type: "string" },
            premiumTeaser: { type: "string" },
            premiumAnalysis: { type: "string" },
            isBestBet: { type: "boolean" }
          }
        }
      }
    }
  };

  const systemPrompt = [
    "You are building the Sharplines daily picks card for a premium sports betting media brand.",
    "Research the latest lines, injuries, projected availability, and market movement before recommending any pick.",
    "Only include picks if the case is supported by current reporting and current betting context.",
    "Use only high-quality sources from this approved family:",
    getApprovedSourceListText(),
    "Do not use scraped content farms, generic announce sites, unverifiable SEO pages, or random low-trust blogs.",
    "Favor major U.S. sportsbooks and markets that can be described clearly for a U.S. audience.",
    "Only use these sportsbook labels: FanDuel, DraftKings, BetMGM, Caesars, Fanatics, BetRivers, Hard Rock Bet.",
    "All start times must be written in ET.",
    "The tone must be sharp, measured, editorial, and realistic. No hype, no guaranteed outcomes, no scam language.",
    "If the board is too unstable or the injury news is too unclear, return status='skip' and explain why.",
    "Mark exactly one pick as isBestBet when publishing a card."
  ].join(" ");

  const buildUserPrompt = (rejectedHosts: string[]) =>
    [
      `Build the card for ${date.displayDate} (${date.isoDate}).`,
      `Sports to focus on: ${sportsFocus.join(", ")}.`,
      "Create a public-facing card with 3 to 5 total picks.",
      "For each pick, include the exact side/total/prop wording, the sportsbook, the current price, and a short premium teaser.",
      "Use unit sizes between 0.5 and 1.5.",
      "Also include 3 to 5 source links that were useful in your research.",
      rejectedHosts.length
        ? `Do not cite these rejected hostnames again: ${rejectedHosts.join(", ")}.`
        : "Use a mix of reporting/official sources and betting-market sources so the card is well supported."
    ].join("\n");

  const validateGeneratedCard = (card: GeneratedCard): CardValidationResult => {
    const sourceValidation = validateSourceNotes(card.sourcingNotes);
    const bestBetCount = card.picks.filter((pick) => pick.isBestBet).length;
    const invalidSportsbooks = Array.from(
      new Set(card.picks.map((pick) => pick.sportsbook).filter((name) => !APPROVED_SPORTSBOOKS.has(name)))
    );
    const invalidStartTimes = card.picks.filter((pick) => !pick.startTime.includes("ET")).map((pick) => pick.pickTitle);

    if (!sourceValidation.ok) {
      return {
        ok: false,
        reason: sourceValidation.reason,
        rejectedHosts: sourceValidation.rejectedHosts
      };
    }

    if (bestBetCount !== 1) {
      return {
        ok: false,
        reason: "Daily card skipped because the generator did not return exactly one best bet.",
        rejectedHosts: sourceValidation.rejectedHosts
      };
    }

    if (invalidSportsbooks.length) {
      return {
        ok: false,
        reason: `Daily card skipped because it used unsupported sportsbook labels: ${invalidSportsbooks.join(", ")}.`,
        rejectedHosts: sourceValidation.rejectedHosts
      };
    }

    if (invalidStartTimes.length) {
      return {
        ok: false,
        reason: `Daily card skipped because some picks were missing ET start times: ${invalidStartTimes.join(", ")}.`,
        rejectedHosts: sourceValidation.rejectedHosts
      };
    }

    return {
      ok: true,
      card: {
        ...card,
        sourcingNotes: sourceValidation.trusted.slice(0, 5).map(({ title, url }) => ({ title, url }))
      },
      rejectedHosts: sourceValidation.rejectedHosts
    };
  };

  let rejectedHosts: string[] = [];

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const generated = await openAiJson<GeneratedCard>({
      schemaName: "generate_daily_card",
      schema: cardSchema,
      system: systemPrompt,
      user: buildUserPrompt(rejectedHosts)
    });

    if (generated.status === "skip") {
      return generated;
    }

    const validation = validateGeneratedCard(generated);

    if (validation.ok) {
      return validation.card;
    }

    rejectedHosts = validation.rejectedHosts;

    if (attempt === 2) {
      return {
        status: "skip",
        skipReason: validation.reason,
        headline: "No card published",
        summary: "",
        premiumIntro: "",
        recordLabel: "Automation hold",
        sourcingNotes: [],
        picks: []
      };
    }
  }

  return {
    status: "skip",
    skipReason: "Daily card skipped because the automation did not produce a trusted card.",
    headline: "No card published",
    summary: "",
    premiumIntro: "",
    recordLabel: "Automation hold",
    sourcingNotes: [],
    picks: []
  };
}

async function storeCard(card: GeneratedCard, date: { isoDate: string; displayDate: string }) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured for automated publishing.");
  }

  const supabase = createSupabaseServiceClient();
  const { data: existing } = await supabase
    .from("daily_cards")
    .select("id")
    .eq("card_date", date.isoDate)
    .maybeSingle();

  const dailyCardId = existing?.id || randomUUID();
  const { data: existingPicks } = await supabase
    .from("picks")
    .select("*")
    .eq("daily_card_id", dailyCardId);

  const { data: graded } = await supabase
    .from("picks")
    .select("result")
    .neq("result", "pending")
    .order("date", { ascending: false })
    .limit(20);

  const gradedWins = graded?.filter((pick) => pick.result === "win").length || 0;
  const gradedLosses = graded?.filter((pick) => pick.result === "loss").length || 0;
  const gradedPushes = graded?.filter((pick) => pick.result === "push").length || 0;
  const recordLabel = card.recordLabel || buildRecordLabel(gradedWins, gradedLosses, gradedPushes);

  const { error: cardError } = await supabase.from("daily_cards").upsert(
    {
      id: dailyCardId,
      card_date: date.isoDate,
      headline: card.headline,
      summary: card.summary,
      premium_intro: card.premiumIntro,
      record_label: recordLabel,
      is_published: true
    },
    { onConflict: "card_date" }
  );

  if (cardError) {
    throw cardError;
  }

  await supabase.from("picks").delete().eq("daily_card_id", dailyCardId);

  if (existingPicks?.length) {
    await logPickChanges(
      existingPicks.map((pick) => ({
        pickId: pick.id,
        changedBy: "automation",
        changeSummary: "Daily card was regenerated and the prior pick entry was archived out of the live card.",
        oldValues: pick,
        newValues: null
      }))
    );
  }

  const insertedPicks = card.picks.map((pick, index) => ({
    id: randomUUID(),
    daily_card_id: dailyCardId,
    date: date.isoDate,
    event: pick.event,
    sport: pick.sport,
    league: pick.league,
    pick_title: pick.pickTitle,
    bet_type: pick.betType,
    market: pick.market,
    line: pick.line,
    odds: pick.odds,
    sportsbook: pick.sportsbook,
    start_time: pick.startTime,
    confidence: pick.confidence,
    units: pick.units,
    short_summary: pick.shortSummary,
    premium_teaser: pick.premiumTeaser,
    premium_analysis: pick.premiumAnalysis,
    result: "pending",
    is_featured: pick.isBestBet,
    is_premium: true,
    posted_at: new Date().toISOString(),
    closing_status: "open",
    sort_order: index + 1
  }));
  const { error: picksError } = await supabase.from("picks").insert(
    insertedPicks
  );

  if (picksError) {
    throw picksError;
  }

  await logPickChanges(
    insertedPicks.map((pick) => ({
      pickId: pick.id,
      changedBy: "automation",
      changeSummary: "Daily card automation published a new pick.",
      oldValues: null,
      newValues: pick
    }))
  );

  return {
    dailyCardId,
    recordLabel
  };
}

export async function runDailyCardAutomation(options?: { date?: Date }) {
  const date = getNewYorkParts(options?.date);
  const grading = await gradePendingPicks(date.isoDate);
  const generated = await generateCard(date);

  if (generated.status === "skip" || !generated.picks.length) {
    return {
      status: "skipped",
      date: date.isoDate,
      reason: generated.skipReason || "The model did not find a strong enough board to publish.",
      grading
    };
  }

  const stored = await storeCard(generated, date);

  return {
    status: "published",
    date: date.isoDate,
    grading,
    stored,
    sources: generated.sourcingNotes
  };
}

export function isAuthorizedAutomationRequest(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const querySecret = url.searchParams.get("secret");

  return authHeader === `Bearer ${secret}` || querySecret === secret;
}

export function shouldRunNow(date = new Date()) {
  const parts = getNewYorkParts(date);
  return parts.hour === 0;
}
