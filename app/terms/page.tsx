import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Terms`,
  description: `Terms and conditions placeholder for ${siteConfig.name}.`
};

export default function TermsPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Terms</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Terms should define content use and membership rules.</h1>
        <p className="mt-4 text-sm leading-7">
          The site should clarify what premium membership includes, how billing works, and how informational betting
          content is framed.
        </p>
        <p className="mt-4 text-sm leading-7">
          {/* TODO: Replace this placeholder with real terms covering subscriptions, refunds, account access, and content usage. */}
          Add your final terms and conditions here before launch, especially around recurring billing and acceptable
          content use.
        </p>
      </div>
    </div>
  );
}
