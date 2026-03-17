"use client";

import { useActionState } from "react";
import { Mail, Send, ShieldCheck, Users } from "lucide-react";
import { sendNewsletterCampaignAction, type AudienceFormState } from "@/app/dashboard/audience/actions";
import type { NewsletterCampaign, NewsletterSubscriber, PremiumMember } from "@/lib/newsletter";

const initialState: AudienceFormState = {
  error: null,
  success: null
};

function formatDate(value: string | null) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

type AudienceManagerProps = {
  subscribers: NewsletterSubscriber[];
  premiumMembers: PremiumMember[];
  campaigns: NewsletterCampaign[];
  setupError?: string | null;
};

export function AudienceManager({ subscribers, premiumMembers, campaigns, setupError }: AudienceManagerProps) {
  const [state, formAction, isPending] = useActionState(sendNewsletterCampaignAction, initialState);
  const activeSubscribers = subscribers.filter((item) => item.status === "active");

  return (
    <div className="space-y-5">
      {setupError ? (
        <div className="panel border-amber-300/20 bg-amber-100/5 p-5 text-sm leading-7 text-amber-100">
          {setupError}
        </div>
      ) : null}

      <div className="panel-strong p-8">
        <p className="muted-label">Audience overview</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Subscribers, members, and sends in one place.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/75">
          This admin view separates newsletter audience management from premium account review. Newsletter signups live
          here, premium members stay visible here, and sends go through the Sharplines email workflow once Resend is configured.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="panel p-5">
            <Users className="h-5 w-5 text-aqua" />
            <p className="mt-3 muted-label">Active subscribers</p>
            <p className="mt-2 text-3xl font-display uppercase text-white">{activeSubscribers.length}</p>
          </div>
          <div className="panel p-5">
            <ShieldCheck className="h-5 w-5 text-neon" />
            <p className="mt-3 muted-label">Premium members</p>
            <p className="mt-2 text-3xl font-display uppercase text-white">{premiumMembers.length}</p>
          </div>
          <div className="panel p-5">
            <Mail className="h-5 w-5 text-aqua" />
            <p className="mt-3 muted-label">Recent campaigns</p>
            <p className="mt-2 text-3xl font-display uppercase text-white">{campaigns.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6">
          <p className="muted-label">Newsletter composer</p>
          <h2 className="mt-2 text-3xl uppercase text-white">Send market notes from Sharplines.</h2>
          <p className="mt-4 text-sm leading-7 text-mist/75">
            Choose the audience, write the note, and Sharplines will send it through Resend. Subscriber emails stay
            separate from premium-member account review so the workflow is cleaner.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="audience" className="glass-input" defaultValue="subscribers">
                <option value="subscribers" className="bg-ink text-white">
                  Newsletter subscribers
                </option>
                <option value="premium-members" className="bg-ink text-white">
                  Premium members
                </option>
                <option value="both" className="bg-ink text-white">
                  Both audiences
                </option>
              </select>
              <input name="previewText" type="text" className="glass-input" placeholder="Optional preview line" />
            </div>

            <input name="subject" type="text" className="glass-input" placeholder="Subject line" />
            <textarea
              name="body"
              rows={10}
              className="glass-input min-h-[220px]"
              placeholder="Write the newsletter body here. Paragraph breaks are preserved."
            />

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="cta-primary" disabled={isPending}>
                <Send className="mr-2 h-4 w-4" />
                {isPending ? "Sending..." : "Send newsletter"}
              </button>
              <p className="text-xs uppercase tracking-[0.18em] text-mist/45">
                Requires `RESEND_API_KEY` and `NEWSLETTER_FROM_EMAIL`
              </p>
            </div>

            {state.error ? <p className="text-sm leading-6 text-amber-100">{state.error}</p> : null}
            {state.success ? <p className="text-sm leading-6 text-neon">{state.success}</p> : null}
          </form>
        </div>

        <div className="panel p-6">
          <p className="muted-label">Recent sends</p>
          <h2 className="mt-2 text-3xl uppercase text-white">Campaign log</h2>
          <div className="mt-6 space-y-3">
            {campaigns.length ? (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{campaign.subject}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-mist/50">
                        {campaign.audience} • {campaign.recipientCount} recipients
                      </p>
                    </div>
                    <span className="rounded-full border border-neon/20 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
                      {campaign.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-mist/65">Sent {formatDate(campaign.sentAt || campaign.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-mist/65">
                No campaigns yet. Once you send your first Sharplines email, it will show up here.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="muted-label">Newsletter signups</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Subscriber list</h2>
            </div>
            <span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-aqua">
              {activeSubscribers.length} active
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {subscribers.length ? (
              subscribers.map((subscriber) => (
                <div key={subscriber.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{subscriber.email}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-mist/50">
                        {subscriber.focus || "General notes"} • {subscriber.source}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-mist/70">
                      {subscriber.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-mist/65">
                    Joined {formatDate(subscriber.subscribedAt)} • Last sent {formatDate(subscriber.lastSentAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-mist/65">
                No newsletter subscribers yet. Once someone uses the Sharplines signup form, they will appear here.
              </div>
            )}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="muted-label">Premium accounts</p>
              <h2 className="mt-2 text-3xl uppercase text-white">Member list</h2>
            </div>
            <span className="rounded-full border border-neon/20 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
              {premiumMembers.length} members
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {premiumMembers.length ? (
              premiumMembers.map((member) => (
                <div key={member.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{member.fullName || member.email}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-mist/50">
                        {member.email} • {member.membershipPlan || "monthly"}
                      </p>
                    </div>
                    <span className="rounded-full border border-neon/20 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
                      {member.subscriptionStatus || member.membershipTier}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-mist/65">Joined {formatDate(member.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-mist/65">
                No premium accounts yet. Once Stripe upgrades a member, they will show up here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
