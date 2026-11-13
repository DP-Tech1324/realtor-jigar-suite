-- Listings performance with all of Ontario stored (tens of thousands of rows).
-- 1. Row-level security: evaluate the staff check once per query, not once per row.
--    (select fn()) lets Postgres run it as an InitPlan; the FOR ALL staff policy also
--    applied to SELECT, so it is split into insert/update/delete.
-- 2. Indexes for the website's search sort order, the map and "city contains" search.

drop policy if exists "listings public read" on public.listings;
create policy "listings public read" on public.listings
  for select using (status <> 'draft' or (select public.is_staff()));

drop policy if exists "listings staff write" on public.listings;
drop policy if exists "listings staff insert" on public.listings;
drop policy if exists "listings staff update" on public.listings;
drop policy if exists "listings staff delete" on public.listings;
create policy "listings staff insert" on public.listings
  for insert with check ((select public.is_staff()));
create policy "listings staff update" on public.listings
  for update using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "listings staff delete" on public.listings
  for delete using ((select public.is_staff()));

-- Search page: Jigar's listings first, then available before pending/sold, newest first
create index if not exists listings_browse_idx
  on public.listings (is_own_listing desc, status, created_at desc);

-- Map: newest listings that have coordinates
create index if not exists listings_map_idx
  on public.listings (is_own_listing desc, created_at desc) where latitude is not null;

-- City search uses ilike '%name%'
create extension if not exists pg_trgm with schema extensions;
create index if not exists listings_city_trgm_idx
  on public.listings using gin (city extensions.gin_trgm_ops);

analyze public.listings;
