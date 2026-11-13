-- Fill brokerage names only for the offices a sync run just looked up, using a small
-- partial index. The old version joined every MLS® listing and timed out at ~45k rows.

create index if not exists listings_missing_office_idx
  on public.listings (list_office_key) where source = 'ddf' and list_office_name is null;

drop function if exists public.fill_ddf_office_names();
create or replace function public.fill_ddf_office_names(keys text[])
returns integer language plpgsql set search_path = public as $$
declare
  filled integer;
begin
  update public.listings l set list_office_name = o.office_name
  from public.ddf_offices o
  where l.source = 'ddf' and l.list_office_name is null
    and l.list_office_key = any(keys) and l.list_office_key = o.office_key;
  get diagnostics filled = row_count;
  return filled;
end;
$$;

revoke execute on function public.fill_ddf_office_names(text[]) from public, anon, authenticated;
grant execute on function public.fill_ddf_office_names(text[]) to service_role;

-- One-time cleanup: leases saved before the per-square-foot rule showed e.g. "$17/month"
update public.listings set price = null
where source = 'ddf' and transaction_type = 'rent' and price < 100;
