import Link from "next/link";
import type { Route } from "next";
import { BarChart3, BookOpen, LayoutDashboard, LogOut, NotebookPen } from "lucide-react";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/login/actions";
import { PremiumBadge } from "@/components/premium-badge";
import { requirePaidMember } from "@/lib/auth";
import { siteConfig } from "@/lib/data";

const memberNav = [
  { href: "/members", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members/today", label: "Today's card", icon: NotebookPen },
  { href: "/members/course", label: "Course", icon: BookOpen },
  { href: "/members/archive", label: "Archive", icon: BarChart3 }
];

export default async function MembersLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requirePaidMember();

  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="panel-strong h-fit p-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="muted-label">Active membership</p>
            <h2 className="mt-2 text-3xl uppercase text-white">{siteConfig.name}</h2>
            <PremiumBadge className="mt-3" />
            <p className="mt-2 break-all text-sm text-mist/70">{session.email}</p>
          </div>
          <nav className="mt-5 space-y-2">
            {memberNav.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className="flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm font-medium text-mist/75 hover:border-aqua/25 hover:bg-aqua/10 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
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
