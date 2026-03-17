import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Affiliate Disclosure`,
  description: `Affiliate disclosure explaining how ${siteConfig.name} handles operator links, editorial independence, and compensation relationships.`
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Affiliate disclosure</p>
        <h1 className="mt-2 text-5xl uppercase text-white">How affiliate relationships are handled on the site.</h1>
        <p className="mt-4 text-sm leading-7">
          {siteConfig.name} may earn commissions from qualifying links to sportsbooks, products, or services mentioned
          on the site. If a reader clicks an approved partner link and completes a qualifying action, {siteConfig.name}
          may receive compensation at no additional cost to the reader.
        </p>
        <p className="mt-4 text-sm leading-7">
          Editorial standards are intended to remain independent of compensation relationships. Sportsbook reviews,
          picks content, guides, and articles are published with the goal of staying factual, measured, and useful to
          readers rather than presenting affiliate partners as guaranteed better options.
        </p>
        <p className="mt-4 text-sm leading-7">
          Some operator links may currently route to an official sportsbook website without affiliate tracking while
          partner approvals are pending. Once approved affiliate links are available, Sharplines should continue to
          identify those placements clearly and maintain the same editorial standard across compensated and
          non-compensated references.
        </p>
        <p className="mt-4 text-sm leading-7">
          Promotions, offers, and operator availability vary by state and can change at any time. Readers should always
          verify current terms directly with the operator before taking action.
        </p>
      </div>
    </div>
  );
}
