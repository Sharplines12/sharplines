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

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;

drop policy if exists "public can read newsletter campaigns" on public.newsletter_campaigns;
create policy "public can read newsletter campaigns"
on public.newsletter_campaigns for select
using (true);
