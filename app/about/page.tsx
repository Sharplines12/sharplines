import type { Metadata } from "next";
import Link from "next/link";
import { AuthorCard } from "@/components/author-card";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | About`,
  description: `Learn how ${siteConfig.name} is positioning itself as a disciplined betting media brand with premium picks, transparent tracking, and long-term editorial value.`
};

export default function AboutPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow={`About ${siteConfig.name}`}
        title="Built to look like a real betting media brand, not a one-week affiliate page."
        copy={`${siteConfig.name} is a premium picks and betting content platform built around one idea: if the product is going to ask for trust, the site has to earn it first through a data-driven approach, disciplined betting, and transparent performance tracking.`}
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-strong p-8">
          <h2 className="text-3xl uppercase text-white">The Sharplines story</h2>
          <p className="mt-4 text-sm leading-7">
            Sharplines was founded by Dale Campbell, a sports betting analysis platform focused on data-driven picks,
            transparent performance tracking, and a long-term approach to betting content.
          </p>
          <p className="mt-4 text-sm leading-7">
            Sharplines started from a simple frustration with the betting space: too many picks brands either look
            flashy and disposable or try to sell confidence without showing enough work. The goal here is different.
            The site is meant to feel like a serious sports betting property with a real editorial layer, a clear
            premium product, and a public record that can be judged over time.
          </p>
          <p className="mt-4 text-sm leading-7">
            That is why the public side of the brand leans into clean guides, sportsbook reviews, and transparent
            results instead of shouting about impossible outcomes. The premium side is where the full card, deeper
            writeups, archived positions, and member workflow live. The split is intentional: editorial trust up front,
            premium depth behind the wall.
          </p>
          <p className="mt-4 text-sm leading-7">
            The business is built for two audiences at once. For members, it has to feel worth paying for every day.
            For operators and affiliate managers, it has to look like a credible media business with staying power.
            Sharplines is designed to signal both.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Education",
                copy:
                  "Sharplines uses guides and evergreen explainers to help readers understand odds, bankroll habits, line movement, and operator differences."
              },
              {
                title: "Comparison",
                copy:
                  "The site is built to encourage price awareness, operator comparisons, and smarter shopping across legal books instead of blind brand loyalty."
              },
              {
                title: "Analysis",
                copy:
                  "Daily picks, deeper writeups, and editorial articles give the brand a sharper point of view than a generic odds feed or promo hub."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-aqua">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-mist/75">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {[
            {
              title: "What Sharplines stands for",
              copy: "Measured betting language, a data-driven approach, disciplined betting, and a premium experience that feels closer to a media product than a random picks feed."
            },
            {
              title: "Why it feels credible",
              copy: "Public wins and losses, transparent performance tracking, cleaner operator coverage, and a paywall tied to a real product instead of vague hype."
            },
            {
              title: "Where it goes from here",
              copy: "Automated publishing, sharper results tracking, more original writing, and deeper educational and comparison coverage built around long-term consistency."
            }
          ].map((item) => (
            <div key={item.title} className="panel p-6">
              <h3 className="text-2xl uppercase text-white">{item.title}</h3>
              <p className="mt-3 text-sm">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <AuthorCard
          title="Founder"
          links={[
            { label: "Contact", href: "/contact" },
            { label: "Responsible Gaming", href: "/responsible-gaming" }
          ]}
        />
        <div className="panel p-6">
          <p className="muted-label">Responsible positioning</p>
          <h2 className="mt-3 text-3xl uppercase text-white">Trust grows from discipline, not hype.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Sports betting involves risk. No outcome is guaranteed, and only wager what you can afford to lose.
            Sharplines is built around analysis-based opinions, disciplined betting, and transparent performance
            tracking rather than hype-driven claims.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/daily-picks" className="cta-secondary">
              Daily Picks
            </Link>
            <Link href="/sportsbooks" className="cta-secondary">
              Sportsbooks
            </Link>
            <Link href="/guides" className="cta-secondary">
              Guides
            </Link>
            <Link href="/responsible-gaming" className="cta-secondary">
              Responsible Gaming
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
