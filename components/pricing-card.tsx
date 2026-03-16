import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

type PricingCardProps = {
  tier: string;
  price: number;
  suffix: string;
  features: string[];
  featured?: boolean;
  cta: ReactNode;
};

export function PricingCard({ tier, price, suffix, features, featured = false, cta }: PricingCardProps) {
  return (
    <div className={cn("panel p-6", featured ? "border-neon/30 bg-neon/[0.06]" : "")}>
      <p className="muted-label">{tier}</p>
      <p className="mt-3 font-display text-5xl uppercase text-white">
        {formatCurrency(price)}
        <span className="ml-2 text-base text-mist/50">{suffix}</span>
      </p>
      <div className="mt-5 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-neon" />
            <span className="text-mist/75">{feature}</span>
          </div>
        ))}
      </div>
      <div className="mt-6">{cta}</div>
    </div>
  );
}
