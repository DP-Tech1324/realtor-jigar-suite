-- Fast property search over ~100k listings on a small Supabase instance.
-- Every search the website offers maps to an index, so nothing scans the whole table:
--   location  -> city_base (exact city, "Brampton" matches "Brampton (Credit Valley)"),
--                postal_compact (prefix, "L6Y" / "L6Y1A1") or mls_number (exact)
--   keywords  -> search_tsv full-text index (title, address, description, keywords)
--   browsing  -> newest first, with partial indexes for homes and for commercial

alter table public.listings
  add column if not exists city_base text
    generated always as (lower(btrim(split_part(city, '(', 1)))) stored,
  add column if not exists postal_compact text
    generated always as (upper(replace(coalesce(postal_code, ''), ' ', ''))) stored,
  add column if not exists search_tsv tsvector
    generated always as (to_tsvector('english',
      coalesce(title, '') || ' ' || coalesce(address, '') || ' ' ||
      coalesce(description, '') || ' ' || coalesce(meta_keywords, ''))) stored;

-- Browsing: newest first (homes = everything except commercial)
create index if not exists listings_homes_recent_idx
  on public.listings (created_at desc) where status <> 'draft' and property_type <> 'commercial';
create index if not exists listings_commercial_recent_idx
  on public.listings (created_at desc) where status <> 'draft' and property_type = 'commercial';

-- Location
create index if not exists listings_city_base_idx
  on public.listings (city_base, created_at desc) where status <> 'draft';
create index if not exists listings_postal_idx
  on public.listings (postal_compact text_pattern_ops) where status <> 'draft';
create index if not exists listings_mls_idx
  on public.listings (mls_number);

-- Keywords
create index if not exists listings_search_tsv_idx
  on public.listings using gin (search_tsv);

-- Price ranges
create index if not exists listings_price_idx
  on public.listings (price) where status <> 'draft';

-- Cities for the location box suggestions (most listings first)
create or replace function public.listing_cities()
returns table (city text, listings bigint)
language sql stable security definer set search_path = public as $$
  select initcap(city_base), count(*)
  from public.listings
  where status <> 'draft' and city_base <> ''
  group by city_base
  order by count(*) desc
  limit 400;
$$;
grant execute on function public.listing_cities() to anon, authenticated;

-- Superseded by the indexes above
drop index if exists public.listings_city_trgm_idx;

analyze public.listings;
