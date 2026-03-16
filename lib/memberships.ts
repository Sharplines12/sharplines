import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export async function syncMembershipFromStripe(params: {
  userId?: string | null;
  email?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  status?: string | null;
  plan?: string | null;
}) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const supabase = createSupabaseServiceClient();

  if (params.userId) {
    await supabase.from("profiles").upsert(
      {
        id: params.userId,
        membership_tier: "premium",
        stripe_customer_id: params.customerId,
        stripe_subscription_id: params.subscriptionId,
        subscription_status: params.status ?? "active",
        membership_plan: params.plan ?? "monthly"
      },
      { onConflict: "id" }
    );

    return;
  }

  if (params.email) {
    const { data: userLookup } = await supabase.auth.admin.listUsers();
    const user = userLookup.users.find((item) => item.email?.toLowerCase() === params.email?.toLowerCase());

    if (!user) {
      return;
    }

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        membership_tier: "premium",
        stripe_customer_id: params.customerId,
        stripe_subscription_id: params.subscriptionId,
        subscription_status: params.status ?? "active",
        membership_plan: params.plan ?? "monthly"
      },
      { onConflict: "id" }
    );
    return;
  }

  if (params.customerId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", params.customerId)
      .maybeSingle();

    if (!profile?.id) {
      return;
    }

    await supabase.from("profiles").update({
      membership_tier: "premium",
      stripe_customer_id: params.customerId,
      stripe_subscription_id: params.subscriptionId,
      subscription_status: params.status ?? "active",
      membership_plan: params.plan ?? "monthly"
    }).eq("id", profile.id);
  }
}
