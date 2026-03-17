import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { PremiumBadge } from "@/components/premium-badge";

type PremiumCtaBlockProps = {
  title: string;
  copy: string;
  compact?: boolean;
};

export function PremiumCtaBlock({ title, copy, compact = false }: PremiumCtaBlockProps) {
  return (
    <div className={`surface-strong ${compact ? "p-6" : "px-6 py-8 sm:px-10 sm:py-12"}`}>
      <PremiumBadge label="Premium membership" />
      <h2 className="mt-4 text-4xl uppercase text-slate-950">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{copy}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <CheckoutButton className="cta-primary">Unlock premium</CheckoutButton>
        <Link href="/pricing" className="cta-secondary">
          Compare plans
        </Link>
      </div>
    </div>
  );
}
