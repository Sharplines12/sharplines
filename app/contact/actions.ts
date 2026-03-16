"use server";

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please complete all fields so the message looks business-ready."
    };
  }

  return {
    success: true,
    message:
      "Form captured. Wire this action to your inbox or CRM next, and this page will become your partnership/contact endpoint."
  };
}
