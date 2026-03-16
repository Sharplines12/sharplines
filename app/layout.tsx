import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Premium Daily Picks & Betting Analysis`,
  description:
    `${siteConfig.name} is a premium sports betting media brand focused on daily top picks, gated premium analysis, sportsbook reviews, and responsible betting content.`,
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const showDemoBanner = siteConfig.isDemoContent && !isSupabaseConfigured();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="relative overflow-hidden">
          <div className="hero-orb left-[-8rem] top-24 h-64 w-64 bg-aqua/20" />
          <div className="hero-orb right-[-4rem] top-72 h-56 w-56 bg-neon/15" />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        {showDemoBanner ? (
          <div className="fixed bottom-4 left-4 z-50 rounded-full border border-ember/30 bg-ember/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100 backdrop-blur">
            Starter demo mode. Connect live data before launch.
          </div>
        ) : null}
      </body>
    </html>
  );
}
