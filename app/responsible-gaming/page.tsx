import type { Metadata } from "next";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Responsible Gaming`,
  description: `Responsible gaming guidance, disclaimers, and 21+ messaging for ${siteConfig.name}.`
};

export default function ResponsibleGamingPage() {
  return (
    <div className="site-container space-y-8 pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Responsible gaming</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Betting content should always come with guardrails.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          Sports betting involves risk. {siteConfig.name} presents opinion-based content and should never frame betting
          as guaranteed or low-risk. Use this page to centralize your responsible gaming language and support links.
        </p>
      </div>
      <ResponsibleGamingBanner />
    </div>
  );
}
