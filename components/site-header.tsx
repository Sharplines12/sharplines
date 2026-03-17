import Link from "next/link";
import type { Route } from "next";
import { MenuSquare } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { SharplinesWordmark } from "@/components/sharplines-wordmark";
import { getSession } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/daily-picks", label: "Daily Picks" },
  { href: "/archive", label: "Archive" },
  { href: "/performance", label: "Performance" },
  { href: "/guides", label: "Guides" },
  { href: "/sportsbooks", label: "Sportsbooks" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/articles", label: "Articles" }
];

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="site-container sticky top-0 z-40 pt-4">
      <div className="panel-strong px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <SharplinesWordmark compact />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href as Route} className="text-sm font-medium text-mist/70 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            {session ? (
              <>
                <Link href="/dashboard" className="cta-secondary">
                  Sportsbook tracker
                </Link>
                <Link href="/casino" className="cta-secondary">
                  Casino tracker
                </Link>
                {session.role === "admin" ? (
                  <Link href="/dashboard/audience" className="cta-secondary">
                    Audience
                  </Link>
                ) : null}
                <form action={logoutAction}>
                  <button type="submit" className="cta-primary">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/signup" className="cta-secondary">
                  Start free tracker
                </Link>
                <Link href="/login" className="cta-secondary">
                  Member login
                </Link>
                <Link href="/pricing" className="cta-primary">
                  Unlock premium
                </Link>
              </>
            )}
          </div>

          <div className="sm:hidden">
            <Link href={session ? "/dashboard" : "/login"} className="cta-secondary px-4 py-2">
              <MenuSquare className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-mist/60"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {session ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
            <Link href="/dashboard" className="whitespace-nowrap rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Sportsbook tracker
            </Link>
            <Link href="/casino" className="whitespace-nowrap rounded-full border border-neon/25 bg-neon/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Casino tracker
            </Link>
            {session.role === "admin" ? (
              <Link href="/dashboard/audience" className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Audience
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
