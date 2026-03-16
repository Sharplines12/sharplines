import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { syncMembershipFromStripe } from "@/lib/memberships";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  const stripe = getStripeClient();
  const appUrl = process.env.APP_URL || new URL(request.url).origin;

  if (!sessionId || !stripe) {
    return NextResponse.redirect(new URL("/login?next=/members", appUrl));
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  const email = checkoutSession.customer_details?.email || checkoutSession.customer_email;

  if (!email || checkoutSession.status !== "complete") {
    return NextResponse.redirect(new URL("/pricing?checkout=cancelled", appUrl));
  }

  await syncMembershipFromStripe({
    userId: checkoutSession.metadata?.user_id || null,
    email,
    customerId: typeof checkoutSession.customer === "string" ? checkoutSession.customer : null,
    subscriptionId: typeof checkoutSession.subscription === "string" ? checkoutSession.subscription : null,
    status: "active",
    plan: checkoutSession.metadata?.plan || "monthly"
  });

  return NextResponse.redirect(new URL("/members?welcome=1", appUrl));
}
