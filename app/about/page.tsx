import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | About`,
  description: `Learn about the brand strategy and editorial positioning behind ${siteConfig.name}.`
};

export default function AboutPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow={`About ${siteConfig.name}`}
        title="A sharper public image for a betting business that wants to look real."
        copy={`${siteConfig.name} is positioned as a disciplined premium picks operator: content-first, transparent about results, and serious about long-term brand trust.`}
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-strong p-8">
          <h2 className="text-3xl uppercase text-white">Brand story</h2>
          <p className="mt-4 text-sm leading-7">
            This site is built for two audiences at once: bettors who need enough proof to buy, and sportsbook
            partners who want to see a real business rather than a throwaway affiliate page. That is why the brand
            system leans premium, the record is public, and the member experience is clearly separated from the
            marketing copy.
          </p>
          <p className="mt-4 text-sm leading-7">
            The public story should stay straightforward. {siteConfig.name} publishes a clean daily card, frames picks
            as opinion-based content, and tracks results honestly. The site deliberately avoids hype-first language
            because the professional look is part of the sales asset.
          </p>
        </div>

        <div className="space-y-5">
          {[
            {
              title: "What the brand signals",
              copy: "Premium sports media aesthetic, disciplined betting language, and enough operator coverage to look current in the market."
            },
            {
              title: "What makes it credible",
              copy: "Public wins and losses, protected member picks, and a real checkout flow instead of a vague DM-to-buy funnel."
            },
            {
              title: "What comes later",
              copy: "AI-assisted posting, richer operator guides, and a smoother admin workflow once live data starts moving through the system."
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
