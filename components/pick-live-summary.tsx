import type { PickEntry } from "@/lib/data";
import { LiveStatusPill } from "@/components/live-status-pill";

type PickLiveSummaryProps = {
  pick: PickEntry;
  compact?: boolean;
};

export function PickLiveSummary({ pick, compact = false }: PickLiveSummaryProps) {
  if (!pick.liveStatus) {
    return null;
  }

  const hasScore = Boolean(pick.scoreboard?.summary && pick.scoreboard.awayScore !== null && pick.scoreboard.homeScore !== null);

  return (
    <div className={compact ? "space-y-2" : "mt-3 space-y-2"}>
      <div className="flex flex-wrap items-center gap-2">
        <LiveStatusPill status={pick.liveStatus} />
        {pick.gameDetail ? (
          <span className="text-xs uppercase tracking-[0.16em] text-mist/45">{pick.gameDetail}</span>
        ) : null}
      </div>
      {hasScore ? (
        <p className="text-sm font-medium text-white">{pick.scoreboard?.summary}</p>
      ) : null}
      {pick.liveStatus === "final" && pick.result === "pending" && !pick.autoGradingSupported ? (
        <p className="text-xs leading-6 text-mist/55">
          Final score is available. This market still needs manual grading because richer stat support is not wired yet.
        </p>
      ) : null}
    </div>
  );
}
