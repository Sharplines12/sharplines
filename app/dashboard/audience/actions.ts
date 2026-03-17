"use server";

import { requireAdminUser } from "@/lib/auth";
import { sendNewsletterCampaign } from "@/lib/newsletter";

export type AudienceFormState = {
  error: string | null;
  success: string | null;
};

export async function sendNewsletterCampaignAction(
  _prevState: AudienceFormState,
  formData: FormData
): Promise<AudienceFormState> {
  try {
    const session = await requireAdminUser("/dashboard/audience");
    const subject = String(formData.get("subject") || "").trim();
    const previewText = String(formData.get("previewText") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const audience = (String(formData.get("audience") || "subscribers").trim() ||
      "subscribers") as "subscribers" | "premium-members" | "both";

    if (!subject || !body) {
      return {
        error: "Add a subject and the email body before sending.",
        success: null
      };
    }

    await sendNewsletterCampaign({
      audience,
      subject,
      previewText,
      body,
      createdBy: session.email
    });

    return {
      error: null,
      success: "Newsletter sent successfully."
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Sharplines could not send that newsletter right now.",
      success: null
    };
  }
}
