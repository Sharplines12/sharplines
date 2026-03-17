import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  focus: string | null;
  source: string;
  status: "active" | "unsubscribed";
  subscribedAt: string;
  updatedAt: string;
  lastSentAt: string | null;
};

export type PremiumMember = {
  id: string;
  email: string;
  fullName: string | null;
  membershipTier: string;
  membershipPlan: string | null;
  subscriptionStatus: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterCampaign = {
  id: string;
  subject: string;
  previewText: string | null;
  audience: "subscribers" | "premium-members" | "both";
  recipientCount: number;
  status: "draft" | "sent" | "failed";
  createdBy: string | null;
  createdAt: string;
  sentAt: string | null;
};

type DbNewsletterSubscriber = {
  id: string;
  email: string;
  focus: string | null;
  source: string;
  status: "active" | "unsubscribed";
  subscribed_at: string;
  updated_at: string;
  last_sent_at: string | null;
};

type DbNewsletterCampaign = {
  id: string;
  subject: string;
  preview_text: string | null;
  audience: NewsletterCampaign["audience"];
  recipient_count: number;
  status: NewsletterCampaign["status"];
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
};

type DbProfile = {
  id: string;
  full_name: string | null;
  membership_tier: string;
  membership_plan: string | null;
  subscription_status: string | null;
  created_at: string;
  updated_at: string;
};

export type SendNewsletterInput = {
  audience: NewsletterCampaign["audience"];
  subject: string;
  previewText: string;
  body: string;
  createdBy?: string | null;
};

function mapSubscriber(row: DbNewsletterSubscriber): NewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    focus: row.focus,
    source: row.source,
    status: row.status,
    subscribedAt: row.subscribed_at,
    updatedAt: row.updated_at,
    lastSentAt: row.last_sent_at
  };
}

function mapCampaign(row: DbNewsletterCampaign): NewsletterCampaign {
  return {
    id: row.id,
    subject: row.subject,
    previewText: row.preview_text,
    audience: row.audience,
    recipientCount: row.recipient_count,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    sentAt: row.sent_at
  };
}

function buildCampaignHtml(subject: string, previewText: string, body: string) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map(
      (chunk) =>
        `<p style="margin:0 0 16px;color:#c8d3df;font-size:16px;line-height:1.7;">${chunk
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br />")}</p>`
    )
    .join("");

  return `
    <div style="margin:0;background:#08111d;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
      <div style="margin:0 auto;max-width:640px;border:1px solid rgba(255,255,255,0.08);border-radius:28px;background:linear-gradient(180deg,#0f1826,#09111c);padding:32px;">
        <p style="margin:0 0 12px;color:#8ce05b;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">Sharplines</p>
        <h1 style="margin:0;color:#f5f7fb;font-size:34px;line-height:1.05;text-transform:uppercase;">${subject
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</h1>
        ${
          previewText
            ? `<p style="margin:16px 0 24px;color:#94a5b7;font-size:15px;line-height:1.7;">${previewText
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</p>`
            : ""
        }
        ${paragraphs}
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0;color:#728396;font-size:12px;line-height:1.7;">
            Sports betting involves risk. No outcome is guaranteed. Only wager what you can afford to lose.
          </p>
        </div>
      </div>
    </div>
  `;
}

async function listAuthUsersById() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (error) {
    throw new Error(error.message);
  }

  return new Map(
    (data.users || []).map((user) => [
      user.id,
      {
        email: user.email || "",
        createdAt: user.created_at || new Date().toISOString()
      }
    ])
  );
}

export async function subscribeNewsletter(params: { email: string; focus?: string; source?: string }) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const email = params.email.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    throw new Error("Add a valid email so Sharplines knows where to send market notes.");
  }

  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email,
      focus: params.focus?.trim() || null,
      source: params.source?.trim() || "site",
      status: "active",
      updated_at: now
    },
    {
      onConflict: "email"
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/audience");
}

export async function getNewsletterSubscribers() {
  if (!isSupabaseConfigured()) {
    return [] as NewsletterSubscriber[];
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data || []) as DbNewsletterSubscriber[]).map(mapSubscriber);
}

export async function getPremiumMembers() {
  if (!isSupabaseConfigured()) {
    return [] as PremiumMember[];
  }

  const supabase = createSupabaseServiceClient();
  const [authUsersById, profileResult] = await Promise.all([
    listAuthUsersById(),
    supabase
      .from("profiles")
      .select("id, full_name, membership_tier, membership_plan, subscription_status, created_at, updated_at")
      .in("membership_tier", ["premium", "admin"])
      .order("updated_at", { ascending: false })
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  return ((profileResult.data || []) as DbProfile[]).map((profile) => {
    const authUser = authUsersById.get(profile.id);

    return {
      id: profile.id,
      email: authUser?.email || "",
      fullName: profile.full_name,
      membershipTier: profile.membership_tier,
      membershipPlan: profile.membership_plan,
      subscriptionStatus: profile.subscription_status,
      createdAt: profile.created_at || authUser?.createdAt || new Date().toISOString(),
      updatedAt: profile.updated_at
    };
  });
}

export async function getNewsletterCampaigns() {
  if (!isSupabaseConfigured()) {
    return [] as NewsletterCampaign[];
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("id, subject, preview_text, audience, recipient_count, status, created_by, created_at, sent_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return ((data || []) as DbNewsletterCampaign[]).map(mapCampaign);
}

function uniqueEmails(...lists: string[][]) {
  return [...new Set(lists.flat().map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

export async function sendNewsletterCampaign(input: SendNewsletterInput) {
  if (!isSupabaseConfigured()) {
    throw new Error("Newsletter sending needs the live database connection.");
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("Add RESEND_API_KEY before sending newsletter emails.");
  }

  const fromAddress = process.env.NEWSLETTER_FROM_EMAIL || "Sharplines <onboarding@resend.dev>";
  const replyTo = process.env.NEWSLETTER_REPLY_TO || undefined;
  const supabase = createSupabaseServiceClient();
  const [subscribers, premiumMembers] = await Promise.all([getNewsletterSubscribers(), getPremiumMembers()]);

  const audienceEmails =
    input.audience === "subscribers"
      ? uniqueEmails(subscribers.filter((item) => item.status === "active").map((item) => item.email))
      : input.audience === "premium-members"
        ? uniqueEmails(premiumMembers.map((item) => item.email))
        : uniqueEmails(
            subscribers.filter((item) => item.status === "active").map((item) => item.email),
            premiumMembers.map((item) => item.email)
          );

  if (audienceEmails.length === 0) {
    throw new Error("There is nobody in that audience yet.");
  }

  const html = buildCampaignHtml(input.subject.trim(), input.previewText.trim(), input.body.trim());
  const text = [input.previewText.trim(), "", input.body.trim()].filter(Boolean).join("\n");
  const chunkSize = 50;

  for (let index = 0; index < audienceEmails.length; index += chunkSize) {
    const recipients = audienceEmails.slice(index, index + chunkSize);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [fromAddress],
        bcc: recipients,
        reply_to: replyTo ? [replyTo] : undefined,
        subject: input.subject.trim(),
        html,
        text
      })
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`Newsletter send failed: ${payload}`);
    }
  }

  const sentAt = new Date().toISOString();
  const { error: campaignError } = await supabase.from("newsletter_campaigns").insert({
    subject: input.subject.trim(),
    preview_text: input.previewText.trim() || null,
    audience: input.audience,
    content_html: html,
    content_text: text,
    recipient_count: audienceEmails.length,
    status: "sent",
    created_by: input.createdBy || null,
    sent_at: sentAt
  });

  if (campaignError) {
    throw new Error(campaignError.message);
  }

  const { error: subscriberError } = await supabase
    .from("newsletter_subscribers")
    .update({ last_sent_at: sentAt, updated_at: sentAt })
    .in(
      "email",
      audienceEmails.filter((email) => subscribers.some((subscriber) => subscriber.email === email))
    );

  if (subscriberError) {
    throw new Error(subscriberError.message);
  }

  revalidatePath("/dashboard/audience");
}
