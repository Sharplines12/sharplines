import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Terms`,
  description: `Terms of use for ${siteConfig.name}, covering memberships, billing, acceptable use, and informational betting content.`
};

export default function TermsPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Terms</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Terms should define content use and membership rules.</h1>
        <p className="mt-4 text-sm leading-7">
          Sharplines provides sports betting media, editorial content, educational guides, and premium membership
          features for informational and entertainment purposes only. Nothing on the site is intended as financial,
          legal, or guaranteed outcome advice.
        </p>
        <p className="mt-4 text-sm leading-7">
          Premium access is personal to the purchasing account and may not be shared, redistributed, scraped, copied,
          resold, or republished. Sharplines may suspend or terminate access where misuse, abuse, fraud, or attempts to
          bypass gating are detected.
        </p>
        <p className="mt-4 text-sm leading-7">
          Paid memberships may renew automatically according to the selected billing cadence unless canceled before the
          next billing date. Pricing, product structure, and membership features may change over time, but active
          subscribers should receive the access level associated with their current plan until the end of the paid
          billing period, subject to applicable law and payment processor rules.
        </p>
        <p className="mt-4 text-sm leading-7">
          Requests relating to account access, billing support, or partnership questions should be directed to{" "}
          <span className="text-white">{siteConfig.contactEmail}</span>. Refund handling, if offered, is subject to the
          site&apos;s posted billing terms and any applicable payment processor requirements.
        </p>
        <p className="mt-4 text-sm leading-7">
          By using the site, readers acknowledge that sportsbook laws, operator availability, and promotional terms vary
          by jurisdiction. Users are responsible for complying with the laws applicable to their location and for
          confirming current operator terms before taking action.
        </p>
      </div>
    </div>
  );
}
