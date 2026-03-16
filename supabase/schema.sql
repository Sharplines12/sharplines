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
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.profiles enable row level security;
alter table public.daily_cards enable row level security;
alter table public.picks enable row level security;
alter table public.articles enable row level security;
alter table public.guides enable row level security;
alter table public.sportsbooks enable row level security;
alter table public.saved_articles enable row level security;
alter table public.saved_picks enable row level security;

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
