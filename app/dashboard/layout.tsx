import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { Archive, BarChart3, Crown, LayoutDashboard, ListChecks, LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { requireAuthenticatedUser, isPaidAccess } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/my-bets", label: "My Bets", icon: ListChecks },
  { href: "/dashboard/compare", label: "Compare", icon: BarChart3 },
  { href: "/dashboard/archive", label: "Archive", icon: Archive }
];

export default async function DashboardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAuthenticatedUser("/dashboard");
  const paidAccess = isPaidAccess(session.role);

  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="panel-strong h-fit p-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="muted-label">Account</p>
            <h2 className="mt-2 text-3xl uppercase text-white">{session.fullName || session.email}</h2>
            <p className="mt-3 text-sm text-mist/70">{paidAccess ? "Premium user" : "Free user"}</p>
            <p className="mt-2 break-all text-sm text-mist/60">{session.email}</p>
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
