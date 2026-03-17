"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/app/signup/actions";

const initialState = {
  error: null,
  success: null
};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <div className="panel p-8">
      <h2 className="text-3xl uppercase text-white">Create account</h2>
      <p className="mt-3 text-sm">Create a free account to browse content, follow the public card, and upgrade later.</p>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Name</label>
          <input name="name" type="text" className="glass-input" placeholder="Your name" />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Email</label>
          <input name="email" type="email" className="glass-input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Password</label>
          <input name="password" type="password" className="glass-input" placeholder="Create a password" />
        </div>
        <button type="submit" className="cta-primary" disabled={isPending}>
          {isPending ? "Creating..." : "Create free account"}
        </button>
        {state.error ? <p className="text-sm text-amber-200">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-neon">{state.success}</p> : null}
      </form>
      <p className="mt-5 text-sm text-mist/60">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:text-aqua">
          Log in
        </Link>
      </p>
    </div>
  );
}
