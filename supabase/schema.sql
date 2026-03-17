create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  membership_tier text not null default 'free' check (membership_tier in ('free', 'premium', 'admin')),
  membership_plan text default 'monthly' check (membership_plan in ('monthly', 'yearly')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_cards (
  id uuid primary key default gen_random_uuid(),
  card_date date not null unique,
  headline text not null,
  summary text not null,
  premium_intro text not null,
  record_label text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  daily_card_id uuid not null references public.daily_cards(id) on delete cascade,
  date date not null,
  event text not null,
  sport text not null,
  league text not null,
  pick_title text not null,
  bet_type text not null,
  market text not null,
  line text not null,
  odds text not null,
  sportsbook text not null,
  start_time text not null,
  confidence text not null check (confidence in ('High', 'Medium', 'Lean')),
  units numeric(4,2) not null,
  short_summary text not null,
  premium_teaser text not null,
  premium_analysis text not null,
  result text not null default 'pending' check (result in ('win', 'loss', 'push', 'pending')),
  is_featured boolean not null default false,
  is_premium boolean not null default true,
  posted_at timestamptz not null default now(),
  settled_at timestamptz,
  profit_loss numeric(8,2) not null default 0,
  closing_status text not null default 'open' check (closing_status in ('open', 'started', 'settled')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.picks add column if not exists is_premium boolean not null default true;
alter table public.picks add column if not exists posted_at timestamptz not null default now();
alter table public.picks add column if not exists settled_at timestamptz;
alter table public.picks add column if not exists profit_loss numeric(8,2) not null default 0;
alter table public.picks add column if not exists closing_status text not null default 'open';

create table if not exists public.articles (
  slug text primary key,
  title text not null,
  excerpt text not null,
  category text not null,
  published_at text not null,
  reading_time text not null,
  hero_kicker text not null,
  content text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guides (
  slug text primary key,
  title text not null,
  excerpt text not null,
  category text not null,
  published_at text not null,
  reading_time text not null,
  hero_kicker text not null,
  content text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sportsbooks (
  slug text primary key,
  name text not null,
  featured_offer_text text not null,
  summary text not null,
  review_bullets text[] not null default '{}',
  affiliate_url text not null default '#',
  disclaimer text not null,
  overview text not null,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  user_experience text not null,
  markets_offered text not null,
  payment_methods text not null,
  best_for text not null,
  promo_summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_articles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  article_slug text not null references public.articles(slug) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, article_slug)
);

create table if not exists public.saved_picks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  pick_id uuid not null references public.picks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, pick_id)
);

create table if not exists public.user_bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  sport text not null,
  league text not null,
  game text not null,
  bet_type text not null,
  pick_title text not null,
  sportsbook text not null,
  odds text not null,
  stake numeric(10,2) not null default 0,
  units numeric(8,2) not null default 0,
  result text not null default 'pending' check (result in ('win', 'loss', 'push', 'pending')),
  profit_loss numeric(8,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  settled_at timestamptz
);

create table if not exists public.casino_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  casino_name text not null,
  game_type text not null,
  buy_in numeric(10,2) not null default 0,
  cash_out numeric(10,2) not null default 0,
  profit_loss numeric(10,2) not null default 0,
  session_length text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pick_change_log (
  id uuid primary key default gen_random_uuid(),
  pick_id uuid not null references public.picks(id) on delete cascade,
  changed_at timestamptz not null default now(),
  changed_by text not null default 'system',
  change_summary text not null,
  old_values jsonb,
  new_values jsonb
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  focus text,
  source text not null default 'site',
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  subscribed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sent_at timestamptz
);

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preview_text text,
  audience text not null check (audience in ('subscribers', 'premium-members', 'both')),
  content_html text not null,
  content_text text not null,
  recipient_count integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'failed')),
  created_by text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

-- TODO: when closing-line-value and line movement tracking go live,
-- add closing_odds, closing_line, clv_units, and market_snapshot columns
-- to public.picks or a dedicated public.pick_market_history table.
-- TODO: when CSV import or screenshot parsing is added for user bet tracking,
-- add import_source, import_batch_id, parsed_payload, and attachment_url fields
-- to public.user_bets or a companion import-jobs table.
-- TODO: when casino session CSV import or partner-linked wallet/session sync exists,
-- add import_source, import_batch_id, source_session_id, attachment_url, and sync_provider
-- fields to public.casino_sessions or a dedicated import-jobs table.
-- TODO: if sportsbook sync partnerships ever exist, keep them in a separate sync layer
-- for public.user_bets rather than implying direct sportsbook account integration today.

alter table public.profiles enable row level security;
alter table public.daily_cards enable row level security;
alter table public.picks enable row level security;
alter table public.articles enable row level security;
alter table public.guides enable row level security;
alter table public.sportsbooks enable row level security;
alter table public.saved_articles enable row level security;
alter table public.saved_picks enable row level security;
alter table public.user_bets enable row level security;
alter table public.casino_sessions enable row level security;
alter table public.pick_change_log enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;

create policy "public can read daily cards"
on public.daily_cards for select
using (true);

create policy "public can read picks"
on public.picks for select
using (true);

create policy "public can read articles"
on public.articles for select
using (true);

create policy "public can read guides"
on public.guides for select
using (true);

create policy "public can read sportsbooks"
on public.sportsbooks for select
using (true);

create policy "public can read newsletter campaigns"
on public.newsletter_campaigns for select
using (true);

create policy "users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "users can upsert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "users can read own saved articles"
on public.saved_articles for select
using (auth.uid() = user_id);

create policy "users can manage own saved articles"
on public.saved_articles for insert
with check (auth.uid() = user_id);

create policy "users can delete own saved articles"
on public.saved_articles for delete
using (auth.uid() = user_id);

create policy "users can read own saved picks"
on public.saved_picks for select
using (auth.uid() = user_id);

create policy "users can manage own saved picks"
on public.saved_picks for insert
with check (auth.uid() = user_id);

create policy "users can delete own saved picks"
on public.saved_picks for delete
using (auth.uid() = user_id);

create policy "users can read own bets"
on public.user_bets for select
using (auth.uid() = user_id);

create policy "users can insert own bets"
on public.user_bets for insert
with check (auth.uid() = user_id);

create policy "users can update own bets"
on public.user_bets for update
using (auth.uid() = user_id);

create policy "users can delete own bets"
on public.user_bets for delete
using (auth.uid() = user_id);

create policy "users can read own casino sessions"
on public.casino_sessions for select
using (auth.uid() = user_id);

create policy "users can insert own casino sessions"
on public.casino_sessions for insert
with check (auth.uid() = user_id);

create policy "users can update own casino sessions"
on public.casino_sessions for update
using (auth.uid() = user_id);

create policy "users can delete own casino sessions"
on public.casino_sessions for delete
using (auth.uid() = user_id);

create policy "public can read pick change log"
on public.pick_change_log for select
using (true);
