"use client";

import { useState } from "react";
import { ArrowRight, ShieldAlert, Wrench } from "lucide-react";
import { SharplinesWordmark } from "@/components/sharplines-wordmark";

export function MaintenanceGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/maintenance-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "Password not recognized.");
        return;
      }

      window.location.reload();
    } catch {
      setError("We couldn't unlock the site right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="maintenance-orb left-[-8rem] top-16 h-72 w-72 bg-aqua/20" />
      <div className="maintenance-orb right-[-6rem] top-40 h-80 w-80 bg-neon/10" />
      <div className="maintenance-orb bottom-[-8rem] left-1/3 h-72 w-72 bg-ember/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="maintenance-panel p-8 sm:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/25 bg-ember/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
              <Wrench className="h-4 w-4" />
              Temporary maintenance mode
            </div>

            <div className="mt-8">
              <SharplinesWordmark />
            </div>

            <h1 className="mt-10 max-w-3xl text-4xl uppercase leading-none text-white sm:text-5xl lg:text-6xl">
              We&apos;re tuning the site before the next push goes live.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-mist/75 sm:text-lg">
              Sharplines is temporarily behind a password while we do maintenance, clean up the board, and tighten a
              few production details. If you&apos;ve got access, enter the password below.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-mist/45">Status</p>
                <p className="mt-3 text-lg font-semibold text-white">Maintenance in progress</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-mist/45">Access</p>
                <p className="mt-3 text-lg font-semibold text-white">Password protected</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-mist/45">Return</p>
                <p className="mt-3 text-lg font-semibold text-white">Back shortly</p>
              </div>
            </div>
          </section>

          <section className="maintenance-panel maintenance-panel-glow p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-aqua/30 bg-aqua/10 text-aqua">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-mist/45">Protected preview</p>
                <h2 className="mt-1 text-2xl uppercase text-white">Enter site password</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  className="glass-input h-14 text-base tracking-[0.18em]"
                  autoFocus
                />
              </label>

              <button type="submit" className="cta-primary h-14 w-full gap-2 text-sm uppercase tracking-[0.16em]" disabled={isSubmitting}>
                {isSubmitting ? "Unlocking..." : "Enter Sharplines"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {error ? <p className="text-sm text-amber-200">{error}</p> : null}
            </form>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-mist/45">Maintenance note</p>
              <p className="mt-3 text-sm leading-7 text-mist/75">
                Core pages are intentionally hidden during maintenance. Responsible gaming and compliance language will
                remain intact when the site is reopened.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
