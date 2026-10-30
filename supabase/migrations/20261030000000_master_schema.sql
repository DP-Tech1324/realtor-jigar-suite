-- Realtor Jigar Suite: master schema
-- Creates every table, function, policy and storage bucket the client site and
-- admin panel use. Safe to run on a fresh Supabase project.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Staff accounts (admin panel access)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  role text not null default 'viewer'
    check (role in ('superadmin', 'admin', 'editor', 'agent', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Role of the signed-in user: their admin_users role, or 'user' for everyone else.
-- security definer so policies can call it without recursing through admin_users RLS.
create or replace function public.get_current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role from public.admin_users where user_id = auth.uid() and is_active),
    'user'
  );
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.get_current_user_role() in ('superadmin', 'admin', 'editor');
$$;

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.get_current_user_role() = 'superadmin';
$$;

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  address text not null,
  city text not null,
  province text not null default 'ON',
  postal_code text,
  price numeric(14, 2),
  property_type text not null default 'single_family'
    check (property_type in ('single_family', 'condo', 'townhouse', 'multi_family', 'land', 'commercial')),
  transaction_type text not null default 'sale' check (transaction_type in ('sale', 'rent')),
  bedrooms integer,
  bathrooms numeric(4, 1),
  square_footage integer,
  lot_size integer,
  year_built integer,
  images text[] not null default '{}',
  cover_image text,
  status text not null default 'draft' check (status in ('active', 'draft', 'pending', 'sold')),
  is_featured boolean not null default false,
  latitude double precision,
  longitude double precision,
  mls_number text,
  features jsonb,
  virtual_tour_url text,
  seo_title text,
  seo_description text,
  meta_keywords text,
  -- Vastu Shastra details (see src/lib/vastu.ts in either app for the shape)
  facing text check (facing in ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW')),
  vastu jsonb,
  vastu_score smallint check (vastu_score between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_city_idx on public.listings (lower(city));
create index if not exists listings_featured_idx on public.listings (is_featured) where is_featured;
create index if not exists listings_vastu_idx on public.listings (vastu_score) where vastu_score is not null;

drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  listing_id uuid references public.listings(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'in-progress', 'resolved', 'closed')),
  assigned_to uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  consultation_type text,
  date date,
  time text,
  message text,
  property_id uuid references public.listings(id) on delete set null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Visitors
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create table if not exists public.listing_views (
  id bigint generated always as identity primary key,
  listing_id uuid not null references public.listings(id) on delete cascade,
  viewed_at timestamptz not null default now()
);
create index if not exists listing_views_viewed_at_idx on public.listing_views (viewed_at);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.listings enable row level security;
alter table public.inquiries enable row level security;
alter table public.consultations enable row level security;
alter table public.newsletter_subscriptions enable row level security;
alter table public.favorites enable row level security;
alter table public.listing_views enable row level security;

-- admin_users: everyone reads their own row, superadmins manage all
drop policy if exists "admin_users read own" on public.admin_users;
create policy "admin_users read own" on public.admin_users
  for select using (user_id = auth.uid() or public.is_superadmin());
drop policy if exists "admin_users superadmin write" on public.admin_users;
create policy "admin_users superadmin write" on public.admin_users
  for all using (public.is_superadmin()) with check (public.is_superadmin());

-- listings: public sees everything except drafts, staff see and edit everything
drop policy if exists "listings public read" on public.listings;
create policy "listings public read" on public.listings
  for select using (status <> 'draft' or public.is_staff());
drop policy if exists "listings staff write" on public.listings;
create policy "listings staff write" on public.listings
  for all using (public.is_staff()) with check (public.is_staff());

-- lead tables: anyone can submit, staff read and manage
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert" on public.inquiries
  for insert with check (true);
drop policy if exists "inquiries staff all" on public.inquiries;
create policy "inquiries staff all" on public.inquiries
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "consultations public insert" on public.consultations;
create policy "consultations public insert" on public.consultations
  for insert with check (true);
drop policy if exists "consultations staff all" on public.consultations;
create policy "consultations staff all" on public.consultations
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "newsletter public insert" on public.newsletter_subscriptions;
create policy "newsletter public insert" on public.newsletter_subscriptions
  for insert with check (true);
drop policy if exists "newsletter staff read" on public.newsletter_subscriptions;
create policy "newsletter staff read" on public.newsletter_subscriptions
  for select using (public.is_staff());

-- favorites: each signed-in visitor manages their own
drop policy if exists "favorites own" on public.favorites;
create policy "favorites own" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- listing views: anyone records a view, staff read the numbers
drop policy if exists "views public insert" on public.listing_views;
create policy "views public insert" on public.listing_views
  for insert with check (true);
drop policy if exists "views staff read" on public.listing_views;
create policy "views staff read" on public.listing_views
  for select using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Storage: listing photos and floor plans
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('realtorjigar-images', 'realtorjigar-images', true)
on conflict (id) do nothing;

drop policy if exists "images public read" on storage.objects;
create policy "images public read" on storage.objects
  for select using (bucket_id = 'realtorjigar-images');
drop policy if exists "images staff write" on storage.objects;
create policy "images staff write" on storage.objects
  for insert with check (bucket_id = 'realtorjigar-images' and public.is_staff());
drop policy if exists "images staff update" on storage.objects;
create policy "images staff update" on storage.objects
  for update using (bucket_id = 'realtorjigar-images' and public.is_staff());
drop policy if exists "images staff delete" on storage.objects;
create policy "images staff delete" on storage.objects
  for delete using (bucket_id = 'realtorjigar-images' and public.is_staff());
