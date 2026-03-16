import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { syncMembershipFromStripe } from "@/lib/memberships";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !signature || !webhookSecret) {
    return NextResponse.json({ received: false }, { status: 200 });
  }

  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await syncMembershipFromStripe({
        userId: session.metadata?.user_id || null,
        email: session.customer_details?.email || session.customer_email,
        customerId: typeof session.customer === "string" ? session.customer : null,
        subscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        status: "active",
        plan: session.metadata?.plan || "monthly"
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      await syncMembershipFromStripe({
        customerId: typeof subscription.customer === "string" ? subscription.customer : null,
        subscriptionId: subscription.id,
        status: subscription.status,
        plan: subscription.items.data[0]?.price?.recurring?.interval === "year" ? "yearly" : "monthly"
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
