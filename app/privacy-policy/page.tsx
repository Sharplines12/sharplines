import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Privacy Policy`,
  description: `Privacy policy placeholder for ${siteConfig.name}.`
};

export default function PrivacyPolicyPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Privacy policy</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Privacy and data handling should be explicit.</h1>
        <p className="mt-4 text-sm leading-7">
          This placeholder page gives the site a complete legal shell for launch staging.
        </p>
        <p className="mt-4 text-sm leading-7">
          {/* TODO: Replace this placeholder with your real privacy policy covering analytics, cookies, account data, and billing data. */}
          Include how user accounts, subscription records, cookies, analytics tools, and contact submissions are stored
          and processed.
        </p>
      </div>
    </div>
  );
}
