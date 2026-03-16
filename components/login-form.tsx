"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/login/actions";
import { siteConfig } from "@/lib/data";

type LoginFormProps = {
  nextPath: string;
};

const initialState = {
  error: null
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="panel p-8">
      <h2 className="text-3xl uppercase text-white">Sign in</h2>
      <p className="mt-3 text-sm">Use the configured credentials to open the protected {siteConfig.name} routes.</p>
      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Email</label>
          <input name="email" type="email" className="glass-input" placeholder="member@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Password</label>
          <input name="password" type="password" className="glass-input" placeholder="••••••••" />
        </div>
        <button type="submit" className="cta-primary" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </button>
        {state.error ? <p className="text-sm text-amber-200">{state.error}</p> : null}
      </form>
    </div>
  );
}
