import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Affiliate Disclosure`,
  description: `Affiliate disclosure information for ${siteConfig.name}.`
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Affiliate disclosure</p>
        <h1 className="mt-2 text-5xl uppercase text-white">How affiliate relationships are handled on the site.</h1>
        <p className="mt-4 text-sm leading-7">
          {siteConfig.name} may earn commissions from qualifying affiliate links. Editorial content should stay
          content-first and trustworthy regardless of affiliate relationships.
        </p>
        <p className="mt-4 text-sm leading-7">
          {/* TODO: Replace this placeholder disclosure with your lawyer-reviewed affiliate disclosure copy. */}
          Add your final affiliate disclosure language here, including how links are marked and how compensation
          relationships are disclosed across reviews and promotional placements.
        </p>
      </div>
    </div>
  );
}
