"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CasinoSession } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";
import { deleteCasinoSessionAction, saveCasinoSessionAction, type CasinoSessionFormState } from "@/app/casino/actions";
import { buildCasinoPerformance } from "@/lib/casino-performance";

type CasinoSessionManagerProps = {
  sessions: CasinoSession[];
  premiumUser?: boolean;
};

const initialState: CasinoSessionFormState = {
  error: null,
  success: null
};

const emptyForm = {
  id: "",
  date: "",
  casinoName: "Fanatics Casino",
  gameType: "Blackjack",
  buyIn: "200",
  cashOut: "0",
  sessionLength: "",
  notes: ""
};

export function CasinoSessionManager({ sessions, premiumUser = false }: CasinoSessionManagerProps) {
  const [formState, formAction, isPending] = useActionState(saveCasinoSessionAction, initialState);
  const [editing, setEditing] = useState(emptyForm);
  const [gameFilter, setGameFilter] = useState("All games");
  const [casinoFilter, setCasinoFilter] = useState("All apps");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const gameTypes = useMemo(() => ["All games", ...Array.from(new Set(sessions.map((session) => session.gameType))).sort()], [sessions]);
  const apps = useMemo(() => ["All apps", ...Array.from(new Set(sessions.map((session) => session.casinoName))).sort()], [sessions]);
  const snapshot = useMemo(() => buildCasinoPerformance(sessions), [sessions]);
  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return sessions
      .filter((session) => (gameFilter === "All games" ? true : session.gameType === gameFilter))
      .filter((session) => (casinoFilter === "All apps" ? true : session.casinoName === casinoFilter))
      .filter((session) =>
        lowered ? [session.casinoName, session.gameType, session.notes].join(" ").toLowerCase().includes(lowered) : true
      );
  }, [sessions, query, gameFilter, casinoFilter]);

  useEffect(() => {
    if (formState.success) {
      setEditing(emptyForm);
      router.refresh();
    }
  }, [formState.success, router]);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-strong p-6 sm:p-8">
          <p className="muted-label">Casino tracker</p>
          <h2 className="mt-2 text-4xl uppercase text-white">Track sessions separately from sportsbook bets.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Sharplines keeps casino tracking session-based so bankroll swings, buy-ins, and cash-outs never get mixed into sportsbook units, ROI, or pick history.
          </p>
          {!premiumUser ? (
            <div className="mt-6 rounded-[24px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/80">
              Free accounts can track casino sessions and review the basics. Premium unlocks deeper casino analytics and advanced filtering.
            </div>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Sessions tracked</p>
              <p className="mt-2 text-3xl uppercase text-white">{snapshot.totalSessions}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Net</p>
              <p className={cn("mt-2 text-3xl uppercase", snapshot.netProfitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                {formatCurrency(snapshot.netProfitLoss)}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Total buy-in</p>
              <p className="mt-2 text-3xl uppercase text-white">{formatCurrency(snapshot.totalBuyIn)}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Average session</p>
              <p className={cn("mt-2 text-3xl uppercase", snapshot.averageSessionResult >= 0 ? "text-neon" : "text-rose-200")}>
                {formatCurrency(snapshot.averageSessionResult)}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/casino/history" className="cta-secondary">
              Session history
            </Link>
            <Link href="/casino/analytics" className="cta-secondary">
              Casino analytics
            </Link>
          </div>
        </div>

        <form action={formAction} className="panel p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">{editing.id ? "Edit session" : "Add session"}</p>
              <h2 className="mt-2 text-3xl uppercase text-white">{editing.id ? "Update a casino session" : "Log a new session"}</h2>
            </div>
            {editing.id ? (
              <button type="button" className="cta-secondary" onClick={() => setEditing(emptyForm)}>
                Clear
              </button>
            ) : null}
          </div>

          <input type="hidden" name="id" value={editing.id} />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { name: "date", label: "Date", type: "date", value: editing.date },
              { name: "casinoName", label: "Casino app", type: "text", value: editing.casinoName },
              { name: "gameType", label: "Game type", type: "text", value: editing.gameType },
              { name: "sessionLength", label: "Session length", type: "text", value: editing.sessionLength },
              { name: "buyIn", label: "Buy-in ($)", type: "number", value: editing.buyIn, step: "0.01" },
              { name: "cashOut", label: "Cash-out ($)", type: "number", value: editing.cashOut, step: "0.01" }
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  step={field.step}
                  className="glass-input"
                  value={field.value}
                  onChange={(event) => setEditing((current) => ({ ...current, [field.name]: event.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Notes</label>
            <textarea
              name="notes"
              className="glass-input min-h-[120px]"
              value={editing.notes}
              onChange={(event) => setEditing((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Table game notes, stop-loss context, session discipline, or bankroll takeaways."
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {formState.error ? <p className="text-rose-200">{formState.error}</p> : null}
              {formState.success ? <p className="text-neon">{formState.success}</p> : null}
            </div>
            <button type="submit" className="cta-primary" disabled={isPending}>
              {editing.id ? "Save session" : "Add session"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Search notes/history</label>
            <input className="glass-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Casino, game, notes" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Game type</label>
            <select className="glass-input" value={gameFilter} onChange={(event) => setGameFilter(event.target.value)}>
              {gameTypes.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Casino app</label>
            <select className="glass-input" value={casinoFilter} onChange={(event) => setCasinoFilter(event.target.value)}>
              {apps.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filtered.length ? (
            filtered.map((session) => (
              <div key={session.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="muted-label">{session.date} • {session.casinoName} • {session.gameType}</p>
                    <h3 className="mt-2 text-2xl uppercase text-white">{session.sessionLength || "Session log"}</h3>
                    <p className="mt-2 text-sm text-mist/75">
                      Buy-in {formatCurrency(session.buyIn)} • Cash-out {formatCurrency(session.cashOut)}
                    </p>
                    {session.notes ? <p className="mt-4 text-sm leading-7 text-mist/70">{session.notes}</p> : null}
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <p className={cn("text-sm font-medium uppercase", session.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                      {formatCurrency(session.profitLoss)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="cta-secondary"
                        onClick={() =>
                          setEditing({
                            id: session.id,
                            date: session.date,
                            casinoName: session.casinoName,
                            gameType: session.gameType,
                            buyIn: String(session.buyIn),
                            cashOut: String(session.cashOut),
                            sessionLength: session.sessionLength || "",
                            notes: session.notes
                          })
                        }
                      >
                        Edit
                      </button>
                      <form action={deleteCasinoSessionAction}>
                        <input type="hidden" name="sessionId" value={session.id} />
                        <button type="submit" className="cta-secondary">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm leading-7 text-mist/65">
              No casino sessions match this filter yet. Add your first session to keep casino tracking separate from sportsbook results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
