import type { PickLiveStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

type LiveStatusPillProps = {
  status: PickLiveStatus;
};

const styles: Record<PickLiveStatus, string> = {
  upcoming: "border-white/10 bg-white/[0.03] text-mist/70",
  live: "border-aqua/25 bg-aqua/10 text-aqua",
  final: "border-white/10 bg-white/[0.06] text-white"
};

export function LiveStatusPill({ status }: LiveStatusPillProps) {
  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", styles[status])}>
      {status}
    </span>
  );
}
