"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession, destroySession } from "@/lib/auth";

export type LoginFormState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const result = await authenticate(formData);
  const nextPath = String(formData.get("next") || "/dashboard");

  if (result.status !== "success") {
    return {
      error:
        result.status === "verify_email"
          ? "Check your email to confirm your account, then log in."
          : result.message
    };
  }

  await createSession(result.user);

  redirect(nextPath as never);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
