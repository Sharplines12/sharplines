import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Login`,
  description: `Log in to access premium picks, sportsbook tracking, casino tracking, and gated member content on ${siteConfig.name}.`
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next || "/members";

  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-strong p-8">
          <span className="eyebrow">Member Login</span>
          <h1 className="mt-5 text-5xl uppercase text-white">Return to your picks, sportsbook tracker, and casino tracker.</h1>
          <p className="mt-4 text-sm leading-7">
            Log in to access the sportsbook tracker, the separate casino tracker, your history and analytics views,
            and the protected premium card if you are a paid member.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-mist/75">
            {[
              "Sportsbook tracker for bets, ROI, win rate, and history.",
              "Casino tracker for session logs, buy-in, cash-out, and net results.",
              "Premium members also unlock current-day picks and deeper writeups before games start."
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-mist/65">
            Need an account first?{" "}
            <Link href="/signup" className="text-white hover:text-aqua">
              Create a free account
            </Link>
          </p>
        </div>

        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
