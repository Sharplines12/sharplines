import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

type PickChangeLogInput = {
  pickId: string;
  changedBy?: string;
  changeSummary: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
};

export async function logPickChanges(entries: PickChangeLogInput[]) {
  if (!entries.length || !isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  try {
    const supabase = createSupabaseServiceClient();
    await supabase.from("pick_change_log").insert(
      entries.map((entry) => ({
        pick_id: entry.pickId,
        changed_by: entry.changedBy || "system",
        change_summary: entry.changeSummary,
        old_values: entry.oldValues ?? null,
        new_values: entry.newValues ?? null
      }))
    );
  } catch {
    // Keep automation non-blocking if audit logging is unavailable.
  }
}
