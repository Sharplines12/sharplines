"use client";

import { useMemo, useState } from "react";
import { BestBetBanner } from "@/components/best-bet-banner";
import { LockedPickCard } from "@/components/locked-pick-card";
import { PickRow } from "@/components/pick-row";
import type { DailyCard } from "@/lib/data";

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

  const filteredPicks = selectedCard.picks.filter((pick) => sport === "All sports" || pick.sport === sport);
  const bestBet = filteredPicks.find((pick) => pick.isBestBet) ?? filteredPicks[0];
  const freePicks = filteredPicks.slice(0, freePreviewCount);
  const lockedPicks = filteredPicks.slice(freePreviewCount);

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

      {bestBet ? <BestBetBanner pick={bestBet} locked /> : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          {freePicks.map((pick) => (
            <PickRow key={pick.id} pick={pick} />
          ))}
        </div>
        <div className="space-y-4">
          {lockedPicks.map((pick) => (
            <LockedPickCard key={pick.id} pick={pick} />
          ))}
        </div>
      </div>
    </div>
  );
}
