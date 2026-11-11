-- CREA DDF (MLS®) listings live in public.listings alongside Jigar's manual listings.
-- The sync (admin-panel/api/ddf-sync.js) owns the feed columns; the admin panel owns
-- facing, Vastu, featured and SEO, so a re-sync never overwrites those edits.

alter table public.listings
  add column if not exists source text not null default 'manual' check (source in ('manual', 'ddf')),
  add column if not exists listing_key text unique,
  add column if not exists listing_url text,
  add column if not exists list_agent_key text,
  add column if not exists list_office_key text,
  add column if not exists list_office_name text,
  add column if not exists is_own_listing boolean not null default false,
  add column if not exists ddf_modified_at timestamptz,
  add column if not exists last_synced_at timestamptz;

create index if not exists listings_source_idx on public.listings (source);
create index if not exists listings_own_idx on public.listings (is_own_listing) where is_own_listing;

-- Insert or refresh feed rows. Columns the admin panel edits are only set on first insert.
create or replace function public.upsert_ddf_listings(rows jsonb)
returns integer language plpgsql set search_path = public as $$
declare
  affected integer;
begin
  insert into public.listings as l (
    source, listing_key, mls_number, listing_url, title, description, address, city, province,
    postal_code, price, property_type, transaction_type, bedrooms, bathrooms, square_footage,
    lot_size, year_built, images, cover_image, status, latitude, longitude, list_agent_key,
    list_office_key, list_office_name, is_own_listing, is_featured, ddf_modified_at, last_synced_at
  )
  select
    'ddf', r.listing_key, r.mls_number, r.listing_url, r.title, r.description, r.address, r.city, r.province,
    r.postal_code, r.price, r.property_type, r.transaction_type, r.bedrooms, r.bathrooms, r.square_footage,
    r.lot_size, r.year_built, coalesce(r.images, '{}'), r.cover_image, 'active', r.latitude, r.longitude,
    r.list_agent_key, r.list_office_key, r.list_office_name, coalesce(r.is_own_listing, false),
    coalesce(r.is_own_listing, false), r.ddf_modified_at, now()
  from jsonb_to_recordset(rows) as r(
    listing_key text, mls_number text, listing_url text, title text, description text, address text,
    city text, province text, postal_code text, price numeric, property_type text, transaction_type text,
    bedrooms integer, bathrooms numeric, square_footage integer, lot_size integer, year_built integer,
    images text[], cover_image text, latitude double precision, longitude double precision,
    list_agent_key text, list_office_key text, list_office_name text, is_own_listing boolean,
    ddf_modified_at timestamptz
  )
  on conflict (listing_key) do update set
    mls_number = excluded.mls_number,
    listing_url = excluded.listing_url,
    title = excluded.title,
    description = excluded.description,
    address = excluded.address,
    city = excluded.city,
    province = excluded.province,
    postal_code = excluded.postal_code,
    price = excluded.price,
    property_type = excluded.property_type,
    transaction_type = excluded.transaction_type,
    bedrooms = excluded.bedrooms,
    bathrooms = excluded.bathrooms,
    square_footage = excluded.square_footage,
    lot_size = excluded.lot_size,
    year_built = excluded.year_built,
    images = excluded.images,
    cover_image = excluded.cover_image,
    status = 'active',
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    list_agent_key = excluded.list_agent_key,
    list_office_key = excluded.list_office_key,
    list_office_name = excluded.list_office_name,
    is_own_listing = excluded.is_own_listing,
    ddf_modified_at = excluded.ddf_modified_at,
    last_synced_at = now()
  where l.source = 'ddf';
  get diagnostics affected = row_count;
  return affected;
end;
$$;

-- CREA requires listings that leave the feed to come off the site.
create or replace function public.remove_stale_ddf_listings(synced_before timestamptz)
returns integer language plpgsql set search_path = public as $$
declare
  removed integer;
begin
  delete from public.listings
  where source = 'ddf' and (last_synced_at is null or last_synced_at < synced_before);
  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- Only the sync job (service role) may call these
revoke execute on function public.upsert_ddf_listings(jsonb) from public, anon, authenticated;
revoke execute on function public.remove_stale_ddf_listings(timestamptz) from public, anon, authenticated;
grant execute on function public.upsert_ddf_listings(jsonb) to service_role;
grant execute on function public.remove_stale_ddf_listings(timestamptz) to service_role;
