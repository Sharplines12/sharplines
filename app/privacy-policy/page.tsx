import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Privacy Policy`,
  description: `Privacy policy for ${siteConfig.name}, including account data, cookies, analytics, contact requests, and billing-related information.`
};

export default function PrivacyPolicyPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="panel-strong p-8">
        <p className="muted-label">Privacy policy</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Privacy and data handling should be explicit.</h1>
        <p className="mt-4 text-sm leading-7">
          Sharplines may collect information that readers provide directly, including account details, contact form
          submissions, newsletter interest, and subscription-related information. The site may also collect technical
          data such as device information, page activity, cookies, and basic analytics events.
        </p>
        <p className="mt-4 text-sm leading-7">
          Account and membership information may be processed through third-party services used to operate the site,
          including hosting, authentication, analytics, database, and payment providers. Payment card details are not
          stored directly by Sharplines when checkout is handled by Stripe or another payment processor.
        </p>
        <p className="mt-4 text-sm leading-7">
          Cookies and similar technologies may be used to support login sessions, site security, analytics, and
          product improvements. Readers can manage cookies through their browser settings, though some site features may
          not function correctly if essential cookies are disabled.
        </p>
        <p className="mt-4 text-sm leading-7">
          Sharplines does not sell personal information in the ordinary course of operating the site. Information may be
          shared with service providers only to the extent needed to host the website, process subscriptions, monitor
          usage, respond to inquiries, or comply with legal obligations.
        </p>
        <p className="mt-4 text-sm leading-7">
          Readers who want to request updates, corrections, or deletion of account-related information can contact{" "}
          <span className="text-white">{siteConfig.contactEmail}</span>. This page should be reviewed and updated as the
          site&apos;s data practices evolve.
        </p>
      </div>
    </div>
  );
}
