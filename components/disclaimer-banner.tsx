import Link from "next/link";
import { TriangleAlert } from "lucide-react";

type DisclaimerBannerProps = {
  title?: string;
  copy: string;
};

export function DisclaimerBanner({
  title = "Editorial and operator notice",
  copy
}: DisclaimerBannerProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-1 h-5 w-5 text-aqua" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</p>
            <p className="mt-2 text-sm text-mist/70">{copy}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
          <Link href="/affiliate-disclosure" className="text-mist/60 hover:text-white">
            Affiliate disclosure
          </Link>
          <Link href="/responsible-gaming" className="text-mist/60 hover:text-white">
            Responsible gaming
          </Link>
        </div>
      </div>
    </div>
  );
}
