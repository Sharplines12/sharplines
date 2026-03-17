import { cn } from "@/lib/utils";

type SharplinesWordmarkProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
  compact?: boolean;
  iconOnly?: boolean;
};

function SharplinesMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-6 w-6">
        <defs>
          <linearGradient id="sharplines-mark-gradient" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ecf4ff" />
            <stop offset="1" stopColor="#b7ff4a" />
          </linearGradient>
        </defs>
        <path
          d="M24 4 40 12v12c0 10.6-7.4 16.8-15.2 19.6a2.2 2.2 0 0 1-1.6 0C15.4 40.8 8 34.6 8 24V12L24 4Z"
          fill="none"
          stroke="url(#sharplines-mark-gradient)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M15 30.5h7.4l4.1-12 3 7h3.5"
          fill="none"
          stroke="#b7ff4a"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function SharplinesWordmark({
  className,
  iconClassName,
  textClassName,
  showTagline = true,
  compact = false,
  iconOnly = false
}: SharplinesWordmarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SharplinesMark className={iconClassName} />
      {iconOnly ? null : (
        <div className={cn("leading-none", textClassName)}>
          <div
            className={cn(
              "flex items-end gap-2 font-display text-[1.7rem] uppercase tracking-[0.08em] text-white",
              compact ? "text-[1.35rem]" : ""
            )}
          >
            <span className="brand-wordmark-sharp">Sharp</span>
            <span className="brand-wordmark-lines">Lines</span>
          </div>
          {showTagline ? (
            <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-mist/45">
              Betting Media + Premium Card
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
