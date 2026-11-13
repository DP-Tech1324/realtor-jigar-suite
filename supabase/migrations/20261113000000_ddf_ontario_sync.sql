-- Ontario-wide MLS® sync: incremental updates by ModificationTimestamp, a daily
-- resumable check of which listings are still in the feed, and a brokerage-name cache.
-- Listings outside Ontario are not stored; the website searches CREA live for them.

-- Progress of the "still in the feed?" pass, which may span several runs
create table if not exists public.ddf_sync_state (
  id smallint primary key default 1 check (id = 1),
  -- ModificationTimestamp the Ontario load has reached; null = start a full load from the beginning
  incremental_cursor timestamptz,
  reconcile_next_url text,
  reconcile_started_at timestamptz,
  reconcile_completed_at timestamptz,
  updated_at timestamptz not null default now()
);
insert into public.ddf_sync_state (id) values (1) on conflict (id) do nothing;
alter table public.ddf_sync_state enable row level security; -- no policies: service role only

-- Brokerage names, looked up once per office
create table if not exists public.ddf_offices (
  office_key text primary key,
  office_name text not null,
  updated_at timestamptz not null default now()
);
alter table public.ddf_offices enable row level security;

create index if not exists listings_ddf_province_modified_idx
  on public.listings (province, ddf_modified_at) where source = 'ddf';

-- Marks listings as still present in the feed
create or replace function public.touch_ddf_listings(keys text[])
returns integer language plpgsql set search_path = public as $$
declare
  touched integer;
begin
  update public.listings set last_synced_at = now()
  where source = 'ddf' and listing_key = any(keys);
  get diagnostics touched = row_count;
  return touched;
end;
$$;

-- After a full pass: remove listings in that province the pass never saw (sold, expired, withdrawn)
create or replace function public.remove_unseen_ddf_listings(seen_since timestamptz, province_code text)
returns integer language plpgsql set search_path = public as $$
declare
  removed integer;
begin
  delete from public.listings
  where source = 'ddf' and province = province_code and not is_own_listing
    and (last_synced_at is null or last_synced_at < seen_since);
  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- Jigar's own listings: remove any that his agent query no longer returns
create or replace function public.remove_missing_own_listings(keys text[])
returns integer language plpgsql set search_path = public as $$
declare
  removed integer;
begin
  delete from public.listings
  where source = 'ddf' and is_own_listing and not (listing_key = any(keys));
  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- Fill brokerage names on listings saved before their office was looked up
create or replace function public.fill_ddf_office_names()
returns integer language plpgsql set search_path = public as $$
declare
  filled integer;
begin
  update public.listings l set list_office_name = o.office_name
  from public.ddf_offices o
  where l.source = 'ddf' and l.list_office_name is null and l.list_office_key = o.office_key;
  get diagnostics filled = row_count;
  return filled;
end;
$$;

revoke execute on function public.touch_ddf_listings(text[]) from public, anon, authenticated;
revoke execute on function public.remove_unseen_ddf_listings(timestamptz, text) from public, anon, authenticated;
revoke execute on function public.remove_missing_own_listings(text[]) from public, anon, authenticated;
revoke execute on function public.fill_ddf_office_names() from public, anon, authenticated;
grant execute on function public.touch_ddf_listings(text[]) to service_role;
grant execute on function public.remove_unseen_ddf_listings(timestamptz, text) to service_role;
grant execute on function public.remove_missing_own_listings(text[]) to service_role;
grant execute on function public.fill_ddf_office_names() to service_role;
grant all on public.ddf_sync_state, public.ddf_offices to service_role;
