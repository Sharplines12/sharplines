import Link from "next/link";
import { SharplinesWordmark } from "@/components/sharplines-wordmark";
import { siteConfig } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="site-container pb-10 pt-20">
      <div className="panel-strong px-6 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SharplinesWordmark />
            <h2 className="mt-2 text-3xl uppercase text-white">{siteConfig.tagline}</h2>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-mist/65">
              {siteConfig.disclosures.map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm text-mist/65">
            <Link href="/daily-picks" className="hover:text-white">
              Daily Picks
            </Link>
            <Link href="/guides" className="hover:text-white">
              Betting Guides
            </Link>
            <Link href="/premium-picks" className="hover:text-white">
              Premium Picks
            </Link>
            <Link href="/sportsbooks" className="hover:text-white">
              Sportsbooks
            </Link>
            <Link href="/articles" className="hover:text-white">
              Articles
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/responsible-gaming" className="hover:text-white">
              Responsible Gaming
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-white">
              Affiliate Disclosure
            </Link>
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-mist/45">
          {siteConfig.responsibleGamingLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
