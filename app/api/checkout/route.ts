import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const requestUrl = new URL(request.url);
  const appUrl = process.env.APP_URL || requestUrl.origin;
  const plan = requestUrl.searchParams.get("plan") === "yearly" ? "yearly" : "monthly";
  const priceId = plan === "yearly" ? process.env.STRIPE_YEARLY_PRICE_ID || process.env.STRIPE_PRICE_ID : process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return NextResponse.json({
      url: "/pricing"
    });
  }

  const session = await getSession();

  if (!session?.email) {
    return NextResponse.json({
      url: "/login?next=/pricing"
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    billing_address_collection: "auto",
    allow_promotion_codes: true,
    customer_email: session?.email,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    metadata: {
      product: `premium-membership-${plan}`,
      plan,
      user_id: session.id || "",
      user_email: session.email
    },
    success_url: `${appUrl}/api/checkout/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`
  });

  return NextResponse.json({
    url: checkoutSession.url
  });
}
