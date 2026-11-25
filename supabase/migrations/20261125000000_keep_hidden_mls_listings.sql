-- Admin "Hide" on an MLS® listing sets status = 'draft'. Keep it hidden when the sync refreshes
-- the row; before this, every refresh set status back to 'active'. Listings that leave CREA's
-- feed are still deleted by the sync as before.
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
    status = case when l.status = 'draft' then 'draft' else 'active' end,
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
