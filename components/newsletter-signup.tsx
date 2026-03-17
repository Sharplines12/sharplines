"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Radar, ShieldCheck } from "lucide-react";
import { submitNewsletterAction } from "@/app/newsletter/actions";

const initialState = {
  success: false,
  message: ""
};

export function NewsletterSignup() {
  const [state, formAction, isPending] = useActionState(submitNewsletterAction, initialState);

  return (
    <div className="surface-strong relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
      <div className="hero-orb -left-4 top-6 h-24 w-24 bg-aqua/15" />
      <div className="hero-orb right-4 top-10 h-28 w-28 bg-neon/10" />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="relative">
          <span className="eyebrow">
            <Mail className="h-4 w-4" />
            Free Market Notes
          </span>
          <h2 className="mt-5 max-w-3xl text-4xl uppercase leading-none text-slate-950 sm:text-5xl">
            Build the free Sharplines audience without making it feel like a cheap popup.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Use this as the calm, free-entry layer of the brand: featured card notes, best-bet alerts, and product
            drops for people who are not ready to buy premium yet.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Radar,
                title: "Market notes",
                copy: "Free readers get the sharpest headline angles and line-watch context."
              },
              {
                icon: ShieldCheck,
                title: "Brand proof",
                copy: "An active list makes Sharplines look like a real media property, not a one-page funnel."
              },
              {
                icon: ArrowRight,
                title: "Premium path",
                copy: "The newsletter becomes the clean free-to-paid bridge into the full card."
              }
            ].map((item) => (
              <div key={item.title} className="surface-soft p-4">
                <item.icon className="h-4 w-4 text-aqua" />
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-5 shadow-[0_24px_80px_rgba(28,45,74,0.08)] backdrop-blur sm:p-6">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="muted-label">Newsletter entry</p>
              <h3 className="mt-2 text-2xl uppercase text-slate-950">Join the Sharplines list</h3>
            </div>
            <div className="rounded-full border border-lime-300 bg-lime-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-800">
              Free
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Start with market notes and featured picks. Upgrade later if you want the full card and deeper analysis.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div className="grid gap-4">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="glass-input"
                autoComplete="email"
              />
              <select name="focus" className="glass-input" defaultValue="Basketball">
                <option value="Basketball">
                  Basketball notes first
                </option>
                <option value="Basketball + Hockey">
                  Basketball + Hockey
                </option>
                <option value="Best Bet Alerts">
                  Best bet alerts
                </option>
              </select>
            </div>

            <button type="submit" className="cta-primary w-full sm:w-auto" disabled={isPending}>
              {isPending ? "Joining..." : "Join free market notes"}
            </button>

            {state.message ? (
              <p className={`text-sm leading-6 ${state.success ? "text-lime-700" : "text-amber-700"}`}>{state.message}</p>
            ) : (
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                This currently runs as a Sharplines waitlist until your email platform is connected.
              </p>
            )}
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Want the full card instead of the free notes layer?</p>
            <Link href="/pricing" className="cta-secondary">
              See premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
