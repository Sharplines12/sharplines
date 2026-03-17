"use server";

import { redirect } from "next/navigation";
import { registerUser } from "@/lib/auth";

export type SignupFormState = {
  error: string | null;
  success: string | null;
};

export async function signupAction(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const result = await registerUser(formData);

  if (result.status === "error") {
    return {
      error: result.message,
      success: null
    };
  }

  if (result.status === "verify_email") {
    return {
      error: null,
      success: "Account created. Check your email to confirm your account, then come back and log in."
    };
  }

  redirect("/dashboard?welcome=free");
}
