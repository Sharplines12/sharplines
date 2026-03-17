import Link from "next/link";
import type { Metadata } from "next";
import type { Route } from "next";
import type { ReactNode } from "react";
import { BarChart3, CircleDollarSign, Crown, Landmark, LogOut, ScrollText } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Casino Tracker`,
  description: `Track casino sessions separately from sportsbook bets with a dedicated session log, history, and analytics dashboard inside ${siteConfig.name}.`
};

const navItems = [
  { href: "/casino", label: "Overview", icon: Landmark },
  { href: "/casino/history", label: "History", icon: ScrollText },
  { href: "/casino/analytics", label: "Analytics", icon: BarChart3 }
];

export default async function CasinoLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAuthenticatedUser("/casino");
  const paidAccess = isPaidAccess(session.role);

  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="panel-strong h-fit p-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="muted-label">Casino tracker</p>
            <h2 className="mt-2 text-3xl uppercase text-white">{session.fullName || session.email}</h2>
            <p className="mt-3 text-sm text-mist/70">{paidAccess ? "Premium user" : "Free user"}</p>
            <p className="mt-2 text-sm leading-7 text-mist/60">
              Session-based tracking for casino play. Sportsbook bets and Sharplines picks stay in their own separate product lane.
            </p>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className="flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm font-medium text-mist/75 hover:border-aqua/25 hover:bg-aqua/10 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href={"/dashboard" as Route}
              className="flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm font-medium text-mist/75 hover:border-aqua/25 hover:bg-aqua/10 hover:text-white"
            >
              <CircleDollarSign className="h-4 w-4" />
              Sportsbook tracker
            </Link>
            {paidAccess ? (
              <Link
                href={"/members" as Route}
                className="flex items-center gap-3 rounded-2xl border border-neon/20 bg-neon/10 px-4 py-3 text-sm font-medium text-neon hover:bg-neon/15"
              >
                <Crown className="h-4 w-4" />
                Premium workspace
              </Link>
            ) : (
              <Link
                href={"/pricing" as Route}
                className="flex items-center gap-3 rounded-2xl border border-aqua/20 bg-aqua/10 px-4 py-3 text-sm font-medium text-aqua hover:bg-aqua/15"
              >
                <Crown className="h-4 w-4" />
                Upgrade to premium
              </Link>
            )}
          </nav>

          <form action={logoutAction} className="mt-5">
            <button type="submit" className="cta-secondary w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </form>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
