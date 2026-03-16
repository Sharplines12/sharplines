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
        title="Free keeps the brand visible. Premium unlocks the real product."
        copy="The pricing page should make the difference between preview access and full-card access immediately clear."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <PricingCard
          tier="Monthly premium"
          price={siteConfig.monthlyPrice}
          suffix="/ month"
          featured
          features={[
            "Full daily top picks and betting card",
            "Complete written analysis and premium notes",
            "Archived picks and record dashboard",
            "Premium dashboard access"
          ]}
          cta={<CheckoutButton className="cta-primary w-full justify-center">Start monthly</CheckoutButton>}
        />
        <PricingCard
          tier="Yearly premium"
          price={siteConfig.yearlyPrice}
          suffix="/ year"
          features={[
            "Everything in monthly premium",
            "Lower effective monthly price",
            "Stronger long-term member retention flow",
            "Priority positioning as the main premium plan"
          ]}
          cta={
            <CheckoutButton className="cta-secondary w-full justify-center" plan="yearly">
              Start yearly
            </CheckoutButton>
          }
        />
      </div>

      <div className="panel p-6">
        <p className="muted-label">Free tier</p>
        <h2 className="mt-2 text-3xl uppercase text-white">Create a free account to follow the content before upgrading.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          A free account gives users a cleaner path into saved content, public picks previews, and the premium upgrade flow.
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
                ["Today's picks", "Limited preview", "Full card"],
                ["Analysis", "Teasers only", "Complete writeups"],
                ["Archive", "Public results", "Premium archive"],
                ["Dashboard", "No", "Yes"],
                ["Saved articles", "No", "Yes"]
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
