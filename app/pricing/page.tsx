import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { PricingCard } from "@/components/pricing-card";
import { ResponsibleGamingBanner } from "@/components/responsible-gaming-banner";
import { SectionHeading } from "@/components/section-heading";
import { faqs, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Pricing`,
  description:
    `Compare free and premium membership access for ${siteConfig.name}, including daily picks, archive access, and premium dashboard features.`
};

export default function PricingPage() {
  return (
    <div className="site-container space-y-10 pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Pricing"
        title="Past picks stay public. Premium unlocks the live edge."
        copy="Sharplines is built to keep historical results, archive pages, and public performance open while gating current-day picks, full premium analysis, and the deeper utility layer behind membership."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <PricingCard
          tier="Monthly premium"
          price={siteConfig.monthlyPrice}
          suffix="/ month"
          featured
          features={[
            "Full current-day top picks and betting card before lock",
            "Complete written analysis and premium notes",
            "Premium-only picks and deeper live-card context",
            "Dashboard compare tools and premium workspace access"
          ]}
          cta={<CheckoutButton className="cta-primary w-full justify-center">Start monthly</CheckoutButton>}
        />
        <div className="panel p-6">
          <p className="muted-label">Membership structure</p>
          <h2 className="mt-3 text-3xl uppercase text-white">One clear premium membership keeps the offer focused.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Sharplines keeps the paid product simple at launch: one monthly membership tied to the full card, deeper
            analysis, archive access, and the protected member dashboard. That structure is easier for readers to
            understand and easier for partners to review.
          </p>
          <div className="mt-6 space-y-3 text-sm text-mist/75">
            {[
              "Monthly premium access is the active subscription product.",
              "Past picks, historical results, and public performance remain visible without a paywall.",
              "Premium exists to unlock the future card, deeper writeups, and the utility layer before games start."
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <p className="muted-label">Free tier</p>
        <h2 className="mt-2 text-3xl uppercase text-white">Create a free account to follow the content before upgrading.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          A free account gives users access to the dashboard, manual bet tracking, compare tools, public archive browsing, and the premium upgrade flow.
        </p>
        <div className="mt-6">
          <Link href="/signup" className="cta-secondary">
            Create free account
          </Link>
        </div>
      </div>

      <div className="panel-strong p-6 sm:p-8">
        <h2 className="text-4xl uppercase text-white">Free vs premium</h2>
        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-mist/45">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/[0.02]">
              {[
                ["Today's picks", "Limited preview", "Full card before lock"],
                ["Analysis", "Teasers only", "Complete writeups"],
                ["Past picks archive", "Full public access", "Full public access"],
                ["Performance stats", "Public access", "Advanced compare + premium context"],
                ["My Bets tracker", "Dashboard access", "Dashboard access"],
                ["Premium workspace", "No", "Yes"]
              ].map(([feature, free, premium]) => (
                <tr key={feature}>
                  <td className="px-4 py-3 text-white">{feature}</td>
                  <td className="px-4 py-3 text-mist/65">{free}</td>
                  <td className="px-4 py-3 text-neon">{premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {faqs.map((faq) => (
          <div key={faq.question} className="panel p-6">
            <h3 className="text-2xl uppercase text-white">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7">{faq.answer}</p>
          </div>
        ))}
      </div>

      <ResponsibleGamingBanner />
    </div>
  );
}
