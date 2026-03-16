import type { DailyCard } from "@/lib/data";
import { buildRecordMetrics } from "@/lib/record-metrics";
import { formatUnits } from "@/lib/utils";

type RecordTrackerProps = {
  cards?: DailyCard[];
};

export function RecordTracker({ cards = [] }: RecordTrackerProps) {
  const metrics = buildRecordMetrics(cards);

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
