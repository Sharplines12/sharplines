import type { Metadata } from "next";
import { AudienceManager } from "@/components/audience-manager";
import { requireAdminUser } from "@/lib/auth";
import {
  getNewsletterCampaigns,
  getNewsletterSubscribers,
  getPremiumMembers,
  type NewsletterCampaign,
  type NewsletterSubscriber,
  type PremiumMember
} from "@/lib/newsletter";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Audience Admin`,
  description: `Review newsletter subscribers, premium members, and recent Sharplines email campaigns from the admin dashboard.`
};

export default async function DashboardAudiencePage() {
  await requireAdminUser("/dashboard/audience");
  let setupError: string | null = null;
  let subscribers: NewsletterSubscriber[] = [];
  let premiumMembers: PremiumMember[] = [];
  let campaigns: NewsletterCampaign[] = [];
  const setupErrors: string[] = [];

  const [subscriberResult, premiumResult, campaignResult] = await Promise.allSettled([
    getNewsletterSubscribers(),
    getPremiumMembers(),
    getNewsletterCampaigns()
  ]);

  if (subscriberResult.status === "fulfilled") {
    subscribers = subscriberResult.value;
  } else {
    setupErrors.push(
      subscriberResult.reason instanceof Error ? subscriberResult.reason.message : "Could not load newsletter subscribers."
    );
  }

  if (premiumResult.status === "fulfilled") {
    premiumMembers = premiumResult.value;
  } else {
    setupErrors.push(
      premiumResult.reason instanceof Error ? premiumResult.reason.message : "Could not load premium members."
    );
  }

  if (campaignResult.status === "fulfilled") {
    campaigns = campaignResult.value;
  } else {
    setupErrors.push(
      campaignResult.reason instanceof Error ? campaignResult.reason.message : "Could not load newsletter campaigns."
    );
  }

  setupError = setupErrors.length ? setupErrors.join(" ") : null;

  return (
    <AudienceManager
      subscribers={subscribers}
      premiumMembers={premiumMembers}
      campaigns={campaigns}
      setupError={setupError}
    />
  );
}
