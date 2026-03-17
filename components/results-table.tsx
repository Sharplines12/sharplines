import Link from "next/link";
import type { DailyCard } from "@/lib/data";
import { flattenDailyCards, formatPickTimestamp } from "@/lib/picks";
import { formatUnits } from "@/lib/utils";
import { ResultPill } from "@/components/result-pill";

type ResultsTableProps = {
  cards: DailyCard[];
};

export function ResultsTable({ cards }: ResultsTableProps) {
  const picks = flattenDailyCards(cards).filter((pick) => pick.result !== "pending");

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-mist/45">
          <tr>
            <th className="px-4 py-3">Posted</th>
            <th className="px-4 py-3">Event</th>
            <th className="px-4 py-3">Sport</th>
            <th className="px-4 py-3">Pick</th>
            <th className="px-4 py-3">Odds</th>
            <th className="px-4 py-3">P/L</th>
            <th className="px-4 py-3">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 bg-white/[0.02]">
          {picks.map((pick) => (
            <tr key={pick.id}>
              <td className="px-4 py-3 text-mist/65">{formatPickTimestamp(pick.postedAt)}</td>
              <td className="px-4 py-3 text-white">
                <Link href={`/picks/${pick.slug}`} className="hover:text-aqua">
                  {pick.event}
                </Link>
              </td>
              <td className="px-4 py-3 text-mist/65">{pick.sport}</td>
              <td className="px-4 py-3 text-mist/75">{pick.line}</td>
              <td className="px-4 py-3 text-mist/75">{pick.odds}</td>
              <td className={`px-4 py-3 ${pick.profitLoss >= 0 ? "text-neon" : "text-rose-200"}`}>{formatUnits(pick.profitLoss)}</td>
              <td className="px-4 py-3 uppercase text-mist/65">
                <ResultPill result={pick.result} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
