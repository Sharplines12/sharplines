import type { DailyCard } from "@/lib/data";
import { formatUnits } from "@/lib/utils";

type RecordTrackerProps = {
  cards?: DailyCard[];
};

function buildMetrics(cards: DailyCard[]) {
  const gradedPicks = cards.flatMap((day) => day.picks).filter((pick) => pick.result !== "pending");
  const totalRisked = gradedPicks.reduce((sum, pick) => sum + pick.units, 0);
  const wins = gradedPicks.filter((pick) => pick.result === "win").length;
  const losses = gradedPicks.filter((pick) => pick.result === "loss").length;
  const pushes = gradedPicks.filter((pick) => pick.result === "push").length;
  const units = gradedPicks.reduce((sum, pick) => {
    if (pick.result === "win") {
      return sum + pick.units * 0.91;
    }

    if (pick.result === "loss") {
      return sum - pick.units;
    }

    return sum;
  }, 0);
  const roi = totalRisked ? (units / totalRisked) * 100 : 0;

  const grouped = new Map<string, { wins: number; losses: number; pushes: number; units: number }>();

  for (const pick of gradedPicks) {
    const current = grouped.get(pick.sport) || { wins: 0, losses: 0, pushes: 0, units: 0 };

    if (pick.result === "win") {
      current.wins += 1;
      current.units += pick.units * 0.91;
    } else if (pick.result === "loss") {
      current.losses += 1;
      current.units -= pick.units;
    } else {
      current.pushes += 1;
    }

    grouped.set(pick.sport, current);
  }

  const latest = gradedPicks.slice().reverse();
  const first = latest[0];
  let streak = "No graded picks yet";

  if (first) {
    let count = 0;

    for (const pick of latest) {
      if (pick.result === first.result) {
        count += 1;
      } else {
        break;
      }
    }

    streak = `${count} ${first.result}${count > 1 ? "s" : ""}`;
  }

  return {
    totals: {
      wins,
      losses,
      pushes,
      units,
      roi,
      totalRisked
    },
    breakdown: Array.from(grouped.entries()).map(([sport, stats]) => ({
      sport,
      ...stats
    })),
    streak
  };
}

export function RecordTracker({ cards = [] }: RecordTrackerProps) {
  const metrics = buildMetrics(cards);

  return (
    <div className="panel-strong p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="muted-label">Record tracker</p>
          <h2 className="mt-2 text-4xl uppercase text-white">Transparent performance snapshot</h2>
        </div>
        <p className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-mist/55">
          Current streak: {metrics.streak}
        </p>
      </div>
      <div className="mt-6 data-grid">
        <div className="panel p-4">
          <p className="muted-label">Overall record</p>
          <p className="mt-2 text-3xl font-display uppercase text-white">
            {metrics.totals.wins}-{metrics.totals.losses}-{metrics.totals.pushes}
          </p>
        </div>
        <div className="panel p-4">
          <p className="muted-label">Units</p>
          <p className="mt-2 text-3xl font-display uppercase text-neon">{formatUnits(metrics.totals.units)}</p>
        </div>
        <div className="panel p-4">
          <p className="muted-label">ROI</p>
          <p className="mt-2 text-3xl font-display uppercase text-white">{metrics.totals.roi.toFixed(1)}%</p>
        </div>
        <div className="panel p-4">
          <p className="muted-label">Risked</p>
          <p className="mt-2 text-3xl font-display uppercase text-white">{metrics.totals.totalRisked.toFixed(1)}u</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {metrics.breakdown.map((item) => (
          <div key={item.sport} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="muted-label">{item.sport}</p>
            <p className="mt-2 text-2xl font-display uppercase text-white">
              {item.wins}-{item.losses}-{item.pushes}
            </p>
            <p className="mt-2 text-sm text-mist/65">{formatUnits(item.units)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
