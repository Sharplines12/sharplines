# Sharplines

Sharplines is a premium sports betting media site built with Next.js App Router, TypeScript, and Tailwind CSS. The product is designed to feel like a real editorial betting property first, with premium daily picks and affiliate monetization layered on top.

## What is already built

- Public media pages: home, daily picks, results, guides, articles, sportsbooks, pricing, about, contact, and legal pages
- Premium member area: dashboard, today's premium card, archive, and course sections
- Free vs premium content gating for the daily card
- Supabase-ready auth and content loading
- Stripe-ready subscription checkout and webhook sync
- Affiliate redirect route via `/go/[slug]`
- Fallback demo content so the site still works before the live backend is connected

## Local startup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Start the site:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Real backend setup

Sharplines now supports a real backend with:

- `Supabase` for auth + database
- `Stripe` for paid memberships
- `Vercel` for deployment

### 1. Create a Supabase project

In Supabase:

1. Create a new project.
2. Open the SQL Editor.
3. Run [`/Users/dale/Documents/Playground/supabase/schema.sql`](/Users/dale/Documents/Playground/supabase/schema.sql).
4. Optional but recommended: run [`/Users/dale/Documents/Playground/supabase/seed.sql`](/Users/dale/Documents/Playground/supabase/seed.sql) to preload starter Sharplines content.

### 2. Fill your `.env` file

Use the values from your Supabase and Stripe dashboards:

- `APP_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_YEARLY_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

The demo login variables can stay in place while you are testing, but once Supabase is configured the app will prefer real Supabase auth.

### 3. Turn on Supabase auth

In Supabase:

1. Go to `Authentication`
2. Enable `Email`
3. Decide whether you want email confirmation on or off for launch
4. Set your site URL to your local URL for testing and your live domain later

### 4. Create Stripe plans

In Stripe:

1. Create one monthly subscription product
2. Create one yearly subscription product
3. Copy both price IDs into `.env`
4. Add a webhook endpoint that points to:

```text
https://your-domain.com/api/stripe/webhook
```

For local testing, use:

```text
http://localhost:3000/api/stripe/webhook
```

Stripe checkout and webhook sync are already wired in:

- [`/Users/dale/Documents/Playground/app/api/checkout/route.ts`](/Users/dale/Documents/Playground/app/api/checkout/route.ts)
- [`/Users/dale/Documents/Playground/app/api/checkout/confirm/route.ts`](/Users/dale/Documents/Playground/app/api/checkout/confirm/route.ts)
- [`/Users/dale/Documents/Playground/app/api/stripe/webhook/route.ts`](/Users/dale/Documents/Playground/app/api/stripe/webhook/route.ts)

### 5. Deploy the site

Recommended deployment path:

1. Push the project to GitHub
2. Import it into Vercel
3. Add the same environment variables in Vercel
4. Set your production domain
5. Update `APP_URL` to your live domain
6. Update Supabase auth URLs and Stripe webhook URLs to match the live domain

## Demo mode vs live mode

- If Supabase is not configured, the app runs in demo mode with local fallback content and demo login credentials.
- If Supabase is configured but your tables are empty, the site still falls back to bundled sample content so the UI does not break.
- Once you add real content in Supabase, the frontend will use that content instead of the fallback data.

## Main backend files

- Supabase client helpers: [`/Users/dale/Documents/Playground/lib/supabase.ts`](/Users/dale/Documents/Playground/lib/supabase.ts)
- Auth/session bridge: [`/Users/dale/Documents/Playground/lib/auth.ts`](/Users/dale/Documents/Playground/lib/auth.ts)
- Content loaders: [`/Users/dale/Documents/Playground/lib/content.ts`](/Users/dale/Documents/Playground/lib/content.ts)
- Membership syncing: [`/Users/dale/Documents/Playground/lib/memberships.ts`](/Users/dale/Documents/Playground/lib/memberships.ts)
- Route protection: [`/Users/dale/Documents/Playground/middleware.ts`](/Users/dale/Documents/Playground/middleware.ts)
- Affiliate link config: [`/Users/dale/Documents/Playground/lib/affiliate-config.ts`](/Users/dale/Documents/Playground/lib/affiliate-config.ts)

## TODOs before going live

- Replace placeholder affiliate URLs in [`/Users/dale/Documents/Playground/lib/affiliate-config.ts`](/Users/dale/Documents/Playground/lib/affiliate-config.ts)
- Replace placeholder legal copy in the legal pages under [`/Users/dale/Documents/Playground/app`](/Users/dale/Documents/Playground/app)
- Add your real contact email and business details in [`/Users/dale/Documents/Playground/lib/data.ts`](/Users/dale/Documents/Playground/lib/data.ts)
- Connect a real Stripe account and live prices
- Decide whether daily picks will be entered manually or by an agent-assisted workflow
- Add real state availability notes for each sportsbook

## Verification

The app has been built successfully with `npm run build` in this workspace after the Supabase backend wiring was added.
