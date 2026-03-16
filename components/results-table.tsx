import type { DailyCard } from "@/lib/data";

type ResultsTableProps = {
  cards: DailyCard[];
};

export function ResultsTable({ cards }: ResultsTableProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-mist/45">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Event</th>
            <th className="px-4 py-3">Sport</th>
            <th className="px-4 py-3">Pick</th>
            <th className="px-4 py-3">Odds</th>
            <th className="px-4 py-3">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 bg-white/[0.02]">
          {cards.flatMap((card) =>
            card.picks.map((pick) => (
              <tr key={pick.id}>
                <td className="px-4 py-3 text-mist/65">{card.date}</td>
                <td className="px-4 py-3 text-white">{pick.event}</td>
                <td className="px-4 py-3 text-mist/65">{pick.sport}</td>
                <td className="px-4 py-3 text-mist/75">{pick.line}</td>
                <td className="px-4 py-3 text-mist/75">{pick.odds}</td>
                <td className="px-4 py-3 uppercase text-mist/65">{pick.result}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
