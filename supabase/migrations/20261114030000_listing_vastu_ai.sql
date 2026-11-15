-- AI Vastu estimates for MLS® listings, made on demand from a listing's floor-plan photo
-- (client-site/api/vastu-check.js). Kept apart from listings.vastu, which holds the details
-- Jigar enters and verifies, so the nightly sync and his edits never mix with estimates.
-- One row per listing: each listing is analysed at most once. Removed with the listing.

create table if not exists public.listing_vastu_ai (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  floor_plan_found boolean not null,
  facing text check (facing in ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW')),
  zones jsonb not null default '{}',
  notes text,
  confidence text check (confidence in ('high', 'medium', 'low')),
  model text,
  created_at timestamptz not null default now()
);

create index if not exists listing_vastu_ai_created_idx on public.listing_vastu_ai (created_at);

alter table public.listing_vastu_ai enable row level security;

-- Anyone can read estimates; only the server function (service role) writes them
drop policy if exists "vastu ai public read" on public.listing_vastu_ai;
create policy "vastu ai public read" on public.listing_vastu_ai for select using (true);

grant select on public.listing_vastu_ai to anon, authenticated;
grant all on public.listing_vastu_ai to service_role;
