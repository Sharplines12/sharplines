import type { Metadata } from "next";
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
        copy={`${siteConfig.name} is a premium picks and betting content platform built around one idea: if the product is going to ask for trust, the site has to earn it first.`}
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-strong p-8">
          <h2 className="text-3xl uppercase text-white">The Sharplines story</h2>
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
        </div>

        <div className="space-y-5">
          {[
            {
              title: "What Sharplines stands for",
              copy: "Measured betting language, disciplined card building, and a premium experience that feels closer to a media product than a random picks feed."
            },
            {
              title: "Why it feels credible",
              copy: "Public wins and losses, cleaner operator coverage, and a paywall that is tied to a real product instead of vague hype or private-message selling."
            },
            {
              title: "Where it goes from here",
              copy: "Automated publishing, sharper results tracking, more original writing, and a stronger operator-facing footprint as the site grows."
            }
          ].map((item) => (
            <div key={item.title} className="panel p-6">
              <h3 className="text-2xl uppercase text-white">{item.title}</h3>
              <p className="mt-3 text-sm">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
