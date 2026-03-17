"use server";

import { requireAuthenticatedUser } from "@/lib/auth";
import { deleteCasinoSession, saveCasinoSession } from "@/lib/casino-sessions";

export type CasinoSessionFormState = {
  error: string | null;
  success: string | null;
};

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
  const numeric = Number(value ?? fallback);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export async function saveCasinoSessionAction(
  _prevState: CasinoSessionFormState,
  formData: FormData
): Promise<CasinoSessionFormState> {
  try {
    const session = await requireAuthenticatedUser("/casino");

    await saveCasinoSession(session.id || "", {
      id: String(formData.get("id") || "").trim() || undefined,
      date: String(formData.get("date") || "").trim(),
      casinoName: String(formData.get("casinoName") || "").trim(),
      gameType: String(formData.get("gameType") || "").trim(),
      buyIn: parseNumber(formData.get("buyIn")),
      cashOut: parseNumber(formData.get("cashOut")),
      sessionLength: String(formData.get("sessionLength") || "").trim(),
      notes: String(formData.get("notes") || "").trim()
    });

    return {
      error: null,
      success: "Casino session saved."
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save that session right now.",
      success: null
    };
  }
}

export async function deleteCasinoSessionAction(formData: FormData) {
  const session = await requireAuthenticatedUser("/casino");
  const sessionId = String(formData.get("sessionId") || "").trim();

  if (!sessionId) {
    throw new Error("Missing session id.");
  }

  await deleteCasinoSession(session.id || "", sessionId);
}
