"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserBet } from "@/lib/data";
import { cn, formatUnits } from "@/lib/utils";
import { ResultPill } from "@/components/result-pill";
import { deleteUserBetAction, saveUserBetAction, type UserBetFormState } from "@/app/dashboard/my-bets/actions";

type UserBetsManagerProps = {
  bets: UserBet[];
  premiumUser?: boolean;
};

const initialState: UserBetFormState = {
  error: null,
  success: null
};

const emptyForm = {
  id: "",
  date: "",
  sport: "Basketball",
  league: "NBA",
  event: "",
  betType: "Spread",
  pickTitle: "",
  sportsbook: "",
  odds: "-110",
  stake: "50",
  units: "1",
  result: "pending",
  notes: ""
};

export function UserBetsManager({ bets, premiumUser = false }: UserBetsManagerProps) {
  const [formState, formAction, isPending] = useActionState(saveUserBetAction, initialState);
  const [editing, setEditing] = useState(emptyForm);
  const [sportFilter, setSportFilter] = useState("All sports");
  const [resultFilter, setResultFilter] = useState("All results");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const sports = useMemo(() => ["All sports", ...Array.from(new Set(bets.map((bet) => bet.sport))).sort()], [bets]);
  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return bets.filter((bet) => (sportFilter === "All sports" ? true : bet.sport === sportFilter))
      .filter((bet) => (resultFilter === "All results" ? true : bet.result === resultFilter))
      .filter((bet) => (lowered ? [bet.event, bet.pickTitle, bet.sportsbook].join(" ").toLowerCase().includes(lowered) : true));
  }, [bets, query, resultFilter, sportFilter]);

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
          <p className="muted-label">My bets</p>
          <h2 className="mt-2 text-4xl uppercase text-white">Track your own card next to Sharplines.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            This is a manual tracker, not a sportsbook sync. Add, edit, and settle your own bets so you can compare your process against the public Sharplines record.
          </p>
          {!premiumUser ? (
            <div className="mt-6 rounded-[24px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/80">
              Premium members can use this tracker as part of the paid utility layer, but it remains available to logged-in users while the product grows.
            </div>
          ) : null}
        </div>

        <form action={formAction} className="panel p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">{editing.id ? "Edit tracked bet" : "Add a tracked bet"}</p>
              <h2 className="mt-2 text-3xl uppercase text-white">{editing.id ? "Update your slip" : "Log a new position"}</h2>
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
              { name: "sport", label: "Sport", type: "text", value: editing.sport },
              { name: "league", label: "League", type: "text", value: editing.league },
              { name: "event", label: "Game / event", type: "text", value: editing.event },
              { name: "betType", label: "Bet type", type: "text", value: editing.betType },
              { name: "pickTitle", label: "Pick / selection", type: "text", value: editing.pickTitle },
              { name: "sportsbook", label: "Sportsbook", type: "text", value: editing.sportsbook },
              { name: "odds", label: "Odds", type: "text", value: editing.odds },
              { name: "stake", label: "Stake ($)", type: "number", value: editing.stake, step: "0.01" },
              { name: "units", label: "Units", type: "number", value: editing.units, step: "0.1" }
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

          <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Result</label>
              <select
                name="result"
                className="glass-input"
                value={editing.result}
                onChange={(event) => setEditing((current) => ({ ...current, result: event.target.value }))}
              >
                {["pending", "win", "loss", "push"].map((option) => (
                  <option key={option} value={option} className="bg-ink text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Notes</label>
              <textarea
                name="notes"
                className="glass-input min-h-[120px]"
                value={editing.notes}
                onChange={(event) => setEditing((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Why you played it, how it compares to the Sharplines card, or what you want to review later."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {formState.error ? <p className="text-rose-200">{formState.error}</p> : null}
              {formState.success ? <p className="text-neon">{formState.success}</p> : null}
            </div>
            <button type="submit" className="cta-primary" disabled={isPending}>
              {editing.id ? "Save changes" : "Add bet"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Search</label>
            <input className="glass-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Game, pick, sportsbook" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sport</label>
            <select className="glass-input" value={sportFilter} onChange={(event) => setSportFilter(event.target.value)}>
              {sports.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Result</label>
            <select className="glass-input" value={resultFilter} onChange={(event) => setResultFilter(event.target.value)}>
              {["All results", "pending", "win", "loss", "push"].map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filtered.length ? (
            filtered.map((bet) => (
              <div key={bet.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="muted-label">{bet.date} • {bet.sport} • {bet.league}</p>
                    <h3 className="mt-2 text-2xl uppercase text-white">{bet.pickTitle}</h3>
                    <p className="mt-2 text-sm text-mist/75">{bet.event} • {bet.betType} • {bet.odds} • {bet.sportsbook}</p>
                    {bet.notes ? <p className="mt-4 text-sm leading-7 text-mist/70">{bet.notes}</p> : null}
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <ResultPill result={bet.result} />
                    <p className={cn("text-sm font-medium", bet.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                      {formatUnits(bet.profitLoss)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="cta-secondary"
                        onClick={() =>
                          setEditing({
                            id: bet.id,
                            date: bet.date,
                            sport: bet.sport,
                            league: bet.league,
                            event: bet.event,
                            betType: bet.betType,
                            pickTitle: bet.pickTitle,
                            sportsbook: bet.sportsbook,
                            odds: bet.odds,
                            stake: String(bet.stake),
                            units: String(bet.units),
                            result: bet.result,
                            notes: bet.notes
                          })
                        }
                      >
                        Edit
                      </button>
                      <form action={deleteUserBetAction}>
                        <input type="hidden" name="betId" value={bet.id} />
                        <button type="submit" className="cta-secondary">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm leading-7 text-mist/65">
              No tracked bets match this filter yet. Add your first wager to start building a personal record beside the public Sharplines archive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
