import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Contact`,
  description: `Contact ${siteConfig.name} for partnerships, support, and media inquiries.`
};

export default function ContactPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="Contact"
        title="Use this page for brand deals, affiliate conversations, and member support."
        copy="The UI is polished now. Hook it to your real inbox or CRM when you are ready to accept live leads."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="panel-strong p-8">
            <p className="muted-label">Business contact</p>
            <h2 className="mt-2 text-3xl uppercase text-white">{siteConfig.contactEmail}</h2>
            <p className="mt-4 text-sm">
              Use this inbox for sportsbook partnerships, course support, and creator-brand conversations.
            </p>
          </div>
          <div className="panel p-6">
            <h3 className="text-2xl uppercase text-white">What this page should convert</h3>
            <p className="mt-3 text-sm">
              The contact page is not just a fallback. It helps operators and collaborators see that {siteConfig.name}
              has a professional destination for outreach, media questions, and commercial discussions.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
