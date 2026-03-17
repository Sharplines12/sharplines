import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Sign Up`,
  description: `Create a free account to follow ${siteConfig.name}, track sportsbook bets, log casino sessions, review history, and upgrade to premium later.`
};

export default function SignupPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-strong p-8">
          <span className="eyebrow">Free account</span>
          <h1 className="mt-5 text-5xl uppercase text-white">Create a free account and unlock the Sharplines tracking tools.</h1>
          <p className="mt-4 text-sm leading-7">
            Free accounts give readers a cleaner path into the site, public picks previews, sportsbook bet tracking,
            casino session tracking, and a clear upgrade route into premium picks without making the brand feel like a
            one-page affiliate shell.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-mist/75">
            {[
              "Track sportsbook bets with history, filters, and YTD review.",
              "Log casino sessions separately with buy-in, cash-out, and bankroll trend views.",
              "Upgrade later for deeper analytics, compare tools, and premium picks before lock."
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
