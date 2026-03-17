"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UserBet } from "@/lib/data";
import { approvedUserSportsbooks } from "@/lib/data";
import { cn, formatCurrency, formatOdds, formatUnits } from "@/lib/utils";
import { ResultPill } from "@/components/result-pill";
import { deleteUserBetAction, saveUserBetAction, type UserBetFormState } from "@/app/dashboard/my-bets/actions";
import { buildUserPerformance } from "@/lib/performance";
import type { SupportedUserBetLeague } from "@/lib/game-slate";

type UserBetsManagerProps = {
  bets: UserBet[];
  premiumUser?: boolean;
};

type SlateGame = {
  id: string;
  date: string;
  sport: string;
  league: SupportedUserBetLeague;
  event: string;
  awayTeam: string;
  homeTeam: string;
  startTime: string;
  status: "upcoming" | "live" | "final";
  statusLabel: string;
  awayScore: number | null;
  homeScore: number | null;
};

type EditingState = {
  id: string;
  date: string;
  sport: string;
  league: SupportedUserBetLeague;
  event: string;
  betType: "Moneyline" | "Spread" | "Total";
  pickTitle: string;
  sportsbook: string;
  odds: string;
  stake: string;
  units: string;
  result: "pending" | "win" | "loss" | "push";
  notes: string;
};

const initialState: UserBetFormState = {
  error: null,
  success: null
};

const SUPPORTED_LEAGUES: SupportedUserBetLeague[] = ["NBA", "NCAA", "NHL"];

function getTodayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York"
  }).format(new Date());
}

const emptyForm = (): EditingState => ({
  id: "",
  date: getTodayIso(),
  sport: "Basketball",
  league: "NBA",
  event: "",
  betType: "Spread",
  pickTitle: "",
  sportsbook: approvedUserSportsbooks[0],
  odds: "-110",
  stake: "50",
  units: "1",
  result: "pending",
  notes: ""
});

function buildPlaceholder(betType: EditingState["betType"], event: string) {
  if (!event) {
    return betType === "Moneyline" ? "Knicks ML" : betType === "Spread" ? "Knicks -4.5" : "Over 221.5";
  }

  const [awayTeam = "Away", homeTeam = "Home"] = event.split(" @ ");
  return betType === "Moneyline"
    ? `${awayTeam} ML`
    : betType === "Spread"
      ? `${awayTeam} -4.5`
      : `Over 221.5`;
}

function buildTicketLabel(bet: UserBet) {
  return `${bet.pickTitle} • ${bet.betType} • ${formatOdds(bet.odds)} • ${bet.sportsbook}`;
}

function normalizeEditableBetType(value: string): EditingState["betType"] {
  const normalized = value.toLowerCase();

  if (normalized.includes("moneyline")) {
    return "Moneyline";
  }

  if (normalized.includes("total")) {
    return "Total";
  }

  return "Spread";
}

export function UserBetsManager({ bets, premiumUser = false }: UserBetsManagerProps) {
  const [formState, formAction, isPending] = useActionState(saveUserBetAction, initialState);
  const [editing, setEditing] = useState<EditingState>(emptyForm);
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("All results");
  const [slateGames, setSlateGames] = useState<SlateGame[]>([]);
  const [slateLoading, setSlateLoading] = useState(false);
  const [slateError, setSlateError] = useState<string | null>(null);
  const router = useRouter();

  const snapshot = useMemo(() => buildUserPerformance(bets), [bets]);
  const pendingBets = useMemo(
    () => bets.filter((bet) => bet.result === "pending").sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime()),
    [bets]
  );
  const settledBets = useMemo(
    () => bets.filter((bet) => bet.result !== "pending").sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()),
    [bets]
  );
  const filteredSettled = useMemo(() => {
    const lowered = query.trim().toLowerCase();

    return settledBets
      .filter((bet) => (resultFilter === "All results" ? true : bet.result === resultFilter))
      .filter((bet) => (lowered ? [bet.event, bet.pickTitle, bet.league, bet.sportsbook].join(" ").toLowerCase().includes(lowered) : true));
  }, [query, resultFilter, settledBets]);
  const selectedGame = useMemo(
    () => slateGames.find((game) => game.event === editing.event) || null,
    [editing.event, slateGames]
  );

  useEffect(() => {
    if (formState.success) {
      setEditing(emptyForm());
      router.refresh();
    }
  }, [formState.success, router]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSlate() {
      setSlateLoading(true);
      setSlateError(null);

      try {
        const response = await fetch(`/api/user-bets/slate?league=${editing.league}&date=${editing.date}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Could not load that day’s slate right now.");
        }

        const payload = (await response.json()) as { games?: SlateGame[] };
        setSlateGames(payload.games || []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSlateGames([]);
        setSlateError(error instanceof Error ? error.message : "Could not load that day’s slate right now.");
      } finally {
        if (!controller.signal.aborted) {
          setSlateLoading(false);
        }
      }
    }

    if (editing.date && editing.league) {
      loadSlate();
    }

    return () => controller.abort();
  }, [editing.date, editing.league]);

  const groupedSettled = useMemo(() => {
    const groups = new Map<string, UserBet[]>();

    for (const bet of filteredSettled) {
      const current = groups.get(bet.date) || [];
      current.push(bet);
      groups.set(bet.date, current);
    }

    return Array.from(groups.entries());
  }, [filteredSettled]);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-strong p-6 sm:p-8">
          <p className="muted-label">Signed-in bet tracker</p>
          <h2 className="mt-2 text-4xl uppercase text-white">Log from the slate, then let midnight grading do the cleanup.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Signed-in users can pick a league, browse that day’s slate, and track the exact sportsbook, line, and odds they actually took. Pending bets stay open until the daily rollover grades supported markets automatically.
          </p>
          {!premiumUser ? (
            <div className="mt-6 rounded-[24px] border border-aqua/20 bg-aqua/10 p-4 text-sm leading-7 text-mist/80">
              This tracker is tied to your account login, so your bet history and midnight grading stay user-specific without exposing anyone else’s tickets.
            </div>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Tracked bets</p>
              <p className="mt-2 text-3xl uppercase text-white">{snapshot.totalBets}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Open tickets</p>
              <p className="mt-2 text-3xl uppercase text-white">{pendingBets.length}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Current streak</p>
              <p className="mt-2 text-3xl uppercase text-white">{snapshot.currentStreak.label}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <p className="muted-label">Units</p>
              <p className={cn("mt-2 text-3xl uppercase", snapshot.units >= 0 ? "text-neon" : "text-rose-200")}>{formatUnits(snapshot.units)}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/history" className="cta-secondary">
              Full history
            </Link>
            <Link href="/dashboard/analytics" className="cta-secondary">
              Analytics
            </Link>
            <Link href="/dashboard/compare" className="cta-secondary">
              Compare to Sharplines
            </Link>
          </div>
          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-mist/70">
            Auto-grading currently supports `moneyline`, `spread`, and `total`. If a market falls outside those buckets or the final score feed is unclear, it stays pending until reviewed instead of being forced.
          </div>
        </div>

        <form action={formAction} className="panel p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">{editing.id ? "Edit tracked bet" : "Build a ticket from today’s slate"}</p>
              <h2 className="mt-2 text-3xl uppercase text-white">{editing.id ? "Update your bet" : "Choose the game, then log the exact slip"}</h2>
            </div>
            {editing.id ? (
              <button type="button" className="cta-secondary" onClick={() => setEditing(emptyForm())}>
                New bet
              </button>
            ) : null}
          </div>

          <input type="hidden" name="id" value={editing.id} />
          <input type="hidden" name="sport" value={editing.sport} />
          <input type="hidden" name="event" value={editing.event} />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">League</label>
              <select
                name="league"
                className="glass-input"
                value={editing.league}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    league: event.target.value as SupportedUserBetLeague,
                    sport: event.target.value === "NHL" ? "Hockey" : "Basketball",
                    event: ""
                  }))
                }
              >
                {SUPPORTED_LEAGUES.map((option) => (
                  <option key={option} value={option} className="bg-ink text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Slate date</label>
              <input
                name="date"
                type="date"
                className="glass-input"
                value={editing.date}
                onChange={(event) => setEditing((current) => ({ ...current, date: event.target.value, event: "" }))}
              />
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="muted-label">League slate</p>
                <p className="mt-2 text-sm text-mist/70">Choose from all games on the selected day. Started or final games stay visible, but open tickets should usually come from upcoming games.</p>
              </div>
              <p className="text-sm text-mist/55">{slateLoading ? "Loading slate..." : `${slateGames.length} games`}</p>
            </div>
            {slateError ? <p className="mt-4 text-sm text-rose-200">{slateError}</p> : null}
            <div className="mt-4 grid gap-3 max-h-[320px] overflow-y-auto pr-1">
              {slateGames.length ? (
                slateGames.map((game) => {
                  const isSelected = game.event === editing.event;
                  return (
                    <button
                      key={game.id}
                      type="button"
                      className={cn(
                        "rounded-[22px] border p-4 text-left transition",
                        isSelected ? "border-neon/60 bg-neon/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      )}
                      onClick={() =>
                        setEditing((current) => ({
                          ...current,
                          date: game.date,
                          sport: game.sport,
                          league: game.league,
                          event: game.event
                        }))
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg uppercase text-white">{game.event}</p>
                          <p className="mt-2 text-sm text-mist/65">{game.startTime}</p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em]",
                            game.status === "upcoming"
                              ? "border-aqua/30 text-aqua"
                              : game.status === "live"
                                ? "border-amber-200/30 text-amber-100"
                                : "border-white/15 text-mist/65"
                          )}
                        >
                          {game.statusLabel}
                        </span>
                      </div>
                      {game.status === "final" && game.awayScore !== null && game.homeScore !== null ? (
                        <p className="mt-3 text-sm text-mist/70">
                          Final score: {game.awayTeam} {game.awayScore} - {game.homeScore} {game.homeTeam}
                        </p>
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[20px] border border-dashed border-white/15 bg-white/[0.02] p-4 text-sm leading-7 text-mist/65">
                  No games are available for that league and date yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Selected game</label>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4 text-sm text-white">
                {selectedGame ? (
                  <>
                    <p className="text-lg uppercase">{selectedGame.event}</p>
                    <p className="mt-2 text-mist/65">{selectedGame.startTime}</p>
                  </>
                ) : (
                  <p className="text-mist/65">Choose a game from the slate above before saving the ticket.</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Bet type</label>
              <select
                name="betType"
                className="glass-input"
                value={editing.betType}
                onChange={(event) => setEditing((current) => ({ ...current, betType: event.target.value as EditingState["betType"] }))}
              >
                {["Moneyline", "Spread", "Total"].map((option) => (
                  <option key={option} value={option} className="bg-ink text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Sportsbook</label>
              <input
                name="sportsbook"
                list="approved-books"
                className="glass-input"
                value={editing.sportsbook}
                onChange={(event) => setEditing((current) => ({ ...current, sportsbook: event.target.value }))}
                placeholder="Choose the exact book you used"
              />
              <datalist id="approved-books">
                {approvedUserSportsbooks.map((book) => (
                  <option key={book} value={book} />
                ))}
              </datalist>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Selection / line</label>
              <input
                name="pickTitle"
                className="glass-input"
                value={editing.pickTitle}
                onChange={(event) => setEditing((current) => ({ ...current, pickTitle: event.target.value }))}
                placeholder={buildPlaceholder(editing.betType, editing.event)}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Odds</label>
              <input
                name="odds"
                className="glass-input"
                value={editing.odds}
                onChange={(event) => setEditing((current) => ({ ...current, odds: event.target.value }))}
                placeholder="-110"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Stake ($)</label>
              <input
                name="stake"
                type="number"
                step="0.01"
                className="glass-input"
                value={editing.stake}
                onChange={(event) => setEditing((current) => ({ ...current, stake: event.target.value }))}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Units</label>
              <input
                name="units"
                type="number"
                step="0.1"
                className="glass-input"
                value={editing.units}
                onChange={(event) => setEditing((current) => ({ ...current, units: event.target.value }))}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Result</label>
              <select
                name="result"
                className="glass-input"
                value={editing.result}
                onChange={(event) => setEditing((current) => ({ ...current, result: event.target.value as EditingState["result"] }))}
              >
                {["pending", "win", "loss", "push"].map((option) => (
                  <option key={option} value={option} className="bg-ink text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Notes</label>
              <textarea
                name="notes"
                className="glass-input min-h-[120px]"
                value={editing.notes}
                onChange={(event) => setEditing((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Why you played it, where your line differed, or what you want to review later."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="text-mist/60">Leave the result on `pending` for midnight auto-grading.</p>
              {formState.error ? <p className="mt-2 text-rose-200">{formState.error}</p> : null}
              {formState.success ? <p className="mt-2 text-neon">{formState.success}</p> : null}
            </div>
            <button type="submit" className="cta-primary" disabled={isPending || !editing.event}>
              {editing.id ? "Save changes" : "Add bet"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="muted-label">Open tickets</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Pending bets waiting on midnight grading.</h2>
            </div>
            <p className="text-sm text-mist/55">{pendingBets.length} pending</p>
          </div>

          <div className="mt-6 space-y-4">
            {pendingBets.length ? (
              pendingBets.map((bet) => (
                <div key={bet.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="muted-label">{bet.date} • {bet.league}</p>
                      <h3 className="mt-2 text-2xl uppercase text-white">{bet.event}</h3>
                      <p className="mt-3 text-sm text-mist/70">{buildTicketLabel(bet)}</p>
                      {bet.notes ? <p className="mt-4 text-sm leading-7 text-mist/70">{bet.notes}</p> : null}
                    </div>
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <ResultPill result={bet.result} />
                      <p className="text-sm text-mist/60">{bet.units.toFixed(1)}u • {formatCurrency(bet.stake)}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="cta-secondary"
                          onClick={() =>
                            setEditing({
                              id: bet.id,
                              date: bet.date,
                              sport: bet.sport,
                              league: bet.league as SupportedUserBetLeague,
                              event: bet.event,
                              betType: normalizeEditableBetType(bet.betType),
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
                No open tickets right now. Once you log a pending bet, it stays here until the supported market is graded on rollover.
              </div>
            )}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="muted-label">Settled history</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Recent results grouped by day instead of a wall of rows.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Search</label>
                <input className="glass-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Game, team, sportsbook" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Result</label>
                <select className="glass-input" value={resultFilter} onChange={(event) => setResultFilter(event.target.value)}>
                  {["All results", "win", "loss", "push"].map((option) => (
                    <option key={option} value={option} className="bg-ink text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {groupedSettled.length ? (
              groupedSettled.map(([date, items]) => (
                <section key={date} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="muted-label">{date}</p>
                    <p className="text-sm text-mist/55">{items.length} settled</p>
                  </div>
                  {items.map((bet) => (
                    <div key={bet.id} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-lg uppercase text-white">{bet.event}</p>
                          <p className="mt-2 text-sm text-mist/70">{buildTicketLabel(bet)}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-mist/45">{bet.league}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <ResultPill result={bet.result} />
                          <p className={cn("text-sm font-medium", bet.profitLoss >= 0 ? "text-neon" : "text-rose-200")}>
                            {formatUnits(bet.profitLoss)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm leading-7 text-mist/65">
                No settled bets match this filter yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
