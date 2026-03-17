import Link from "next/link";
import { SharplinesWordmark } from "@/components/sharplines-wordmark";
import { siteConfig } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="site-container pb-10 pt-20">
      <div className="surface-strong px-6 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SharplinesWordmark />
            <h2 className="mt-2 max-w-2xl text-3xl uppercase text-slate-950">{siteConfig.tagline}</h2>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
              {siteConfig.disclosures.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-500">
            <Link href="/daily-picks" className="hover:text-slate-950">
              Daily Picks
            </Link>
            <Link href="/guides" className="hover:text-slate-950">
              Betting Guides
            </Link>
            <Link href="/premium-picks" className="hover:text-slate-950">
              Premium Picks
            </Link>
            <Link href="/sportsbooks" className="hover:text-slate-950">
              Sportsbooks
            </Link>
            <Link href="/articles" className="hover:text-slate-950">
              Articles
            </Link>
            <Link href="/pricing" className="hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/responsible-gaming" className="hover:text-slate-950">
              Responsible Gaming
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-slate-950">
              Affiliate Disclosure
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-950">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-950">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-slate-400">
          {siteConfig.responsibleGamingLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
