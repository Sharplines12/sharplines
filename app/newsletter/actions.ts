"use server";

import { subscribeNewsletter } from "@/lib/newsletter";

export type NewsletterFormState = {
  success: boolean;
  message: string;
};

export async function submitNewsletterAction(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const focus = String(formData.get("focus") || "").trim();

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Add a valid email so we know where to send Sharplines market notes."
    };
  }

  try {
    await subscribeNewsletter({
      email,
      focus,
      source: "homepage-signup"
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Sharplines could not save that email right now."
    };
  }

  return {
    success: true,
    message: focus
      ? `You're on the Sharplines market notes list for ${focus.toLowerCase()}.`
      : "You're on the Sharplines market notes list."
  };
}
