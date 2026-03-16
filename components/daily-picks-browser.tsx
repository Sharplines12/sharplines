"use client";

import { useMemo, useState } from "react";
import { BestBetBanner } from "@/components/best-bet-banner";
import { LockedPickCard } from "@/components/locked-pick-card";
import { PickRow } from "@/components/pick-row";
import type { DailyCard } from "@/lib/data";
import { splitCardPicks } from "@/lib/pick-timing";

type DailyPicksBrowserProps = {
  cards: DailyCard[];
  freePreviewCount: number;
};

export function DailyPicksBrowser({ cards, freePreviewCount }: DailyPicksBrowserProps) {
  const [sport, setSport] = useState("All sports");
  const [date, setDate] = useState(cards[0]?.date ?? "");

  const sports = useMemo(
    () => ["All sports", ...Array.from(new Set(cards.flatMap((card) => card.picks.map((pick) => pick.sport))))],
    [cards]
  );

  const selectedCard = cards.find((card) => card.date === date) ?? cards[0];
  const {
    filteredPicks,
    upcomingPicks,
    archivedPicks,
    freeUpcomingPicks,
    lockedUpcomingPicks,
    bestUpcomingPick,
    bestAvailablePick
  } = useMemo(
    () => splitCardPicks(selectedCard, sport, freePreviewCount),
    [freePreviewCount, selectedCard, sport]
  );

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Filter by sport</label>
            <select
              className="glass-input"
              value={sport}
              onChange={(event) => setSport(event.target.value)}
            >
              {sports.map((option) => (
                <option key={option} value={option} className="bg-ink text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-mist/45">Filter by date</label>
            <select
              className="glass-input"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            >
              {cards.map((card) => (
                <option key={card.id} value={card.date} className="bg-ink text-white">
                  {card.date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {bestUpcomingPick ? (
        <BestBetBanner pick={bestUpcomingPick} locked />
      ) : bestAvailablePick ? (
        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Archive mode</p>
          <h2 className="mt-3 text-3xl uppercase text-white">Today&apos;s teaser card has moved into the archive.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/70">
            Every filtered pick on this card has already started or been graded. The live teaser area below now shows
            archived entries so the board still reads cleanly instead of pretending old starts are still upcoming.
          </p>
        </div>
      ) : null}

      {upcomingPicks.length ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Upcoming card</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Only the still-live teaser stays up front.</h2>
            </div>
            <p className="text-sm text-mist/60">
              {upcomingPicks.length} upcoming pick{upcomingPicks.length === 1 ? "" : "s"} still on the board
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              {freeUpcomingPicks.map((pick) => (
                <PickRow key={pick.id} pick={pick} />
              ))}
            </div>
            <div className="space-y-4">
              {lockedUpcomingPicks.map((pick) => (
                <LockedPickCard key={pick.id} pick={pick} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {archivedPicks.length ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-mist/45">Archived card area</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Already-started and graded plays move down here.</h2>
            </div>
            <p className="text-sm text-mist/60">
              {archivedPicks.length} archived pick{archivedPicks.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid gap-4">
            {archivedPicks.map((pick) => (
              <PickRow key={pick.id} pick={pick} />
            ))}
          </div>
        </section>
      ) : null}

      {!filteredPicks.length ? (
        <div className="panel p-6">
          <p className="text-sm text-mist/70">No picks match that filter yet.</p>
        </div>
      ) : null}
    </div>
  );
}
