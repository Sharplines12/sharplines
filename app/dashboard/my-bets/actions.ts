"use server";

import { requireAuthenticatedUser } from "@/lib/auth";
import { deleteUserBet, saveUserBet } from "@/lib/user-bets";

export type UserBetFormState = {
  error: string | null;
  success: string | null;
};

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
  const numeric = Number(value ?? fallback);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export async function saveUserBetAction(_prevState: UserBetFormState, formData: FormData): Promise<UserBetFormState> {
  try {
    const session = await requireAuthenticatedUser("/dashboard/my-bets");
    await saveUserBet(session.id || "", {
      id: String(formData.get("id") || "").trim() || undefined,
      date: String(formData.get("date") || "").trim(),
      sport: String(formData.get("sport") || "").trim(),
      league: String(formData.get("league") || "").trim(),
      event: String(formData.get("event") || "").trim(),
      betType: String(formData.get("betType") || "").trim(),
      pickTitle: String(formData.get("pickTitle") || "").trim(),
      sportsbook: String(formData.get("sportsbook") || "").trim(),
      odds: String(formData.get("odds") || "").trim(),
      stake: parseNumber(formData.get("stake")),
      units: parseNumber(formData.get("units")),
      result: (String(formData.get("result") || "pending").trim() || "pending") as "win" | "loss" | "push" | "pending",
      notes: String(formData.get("notes") || "").trim()
    });

    return {
      error: null,
      success: "Bet saved to your tracker."
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save that bet right now.",
      success: null
    };
  }
}

export async function deleteUserBetAction(formData: FormData) {
  const session = await requireAuthenticatedUser("/dashboard/my-bets");
  const betId = String(formData.get("betId") || "").trim();

  if (!betId) {
    throw new Error("Missing bet id.");
  }

  await deleteUserBet(session.id || "", betId);
}
