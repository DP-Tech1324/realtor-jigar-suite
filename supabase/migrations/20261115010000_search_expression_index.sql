-- Free ~150 MB on the free plan (0.5 GB limit): keyword search no longer stores a tsvector
-- column on every listing. The stored search_tsv column was the largest thing in the database
-- (157 MB, more than all descriptions). The full-text index is now built on the expression
-- itself, and listings_public computes search_tsv from the same expression, so the site's
-- .textSearch('search_tsv', ...) is unchanged and still uses the index.
--
-- The expression in the index and in the view must stay identical, or searches stop using
-- the index. Run with a long timeout (psql over the session pooler); the dashboard SQL editor
-- may time out building the index. Then run VACUUM FULL public.listings to give the space back.

set statement_timeout = 0;

begin;

drop view if exists public.listings_public;
drop index if exists public.listings_search_tsv_idx;
alter table public.listings drop column if exists search_tsv;

create index listings_search_idx on public.listings using gin (
  to_tsvector('english'::regconfig,
    coalesce(title, '') || ' ' || coalesce(address, '') || ' ' ||
    coalesce(description, '') || ' ' || coalesce(meta_keywords, ''))
);

-- Same as 20261114010000_listings_public_view, plus the computed search column
create view public.listings_public as
  select l.*,
    to_tsvector('english'::regconfig,
      coalesce(l.title, '') || ' ' || coalesce(l.address, '') || ' ' ||
      coalesce(l.description, '') || ' ' || coalesce(l.meta_keywords, '')) as search_tsv
  from public.listings l
  where l.status <> 'draft';

revoke all on public.listings_public from anon, authenticated;
grant select on public.listings_public to anon, authenticated;

comment on view public.listings_public is
  'Non-draft listings for public search. Same rows the RLS policy shows visitors; avoids RLS planner limits. search_tsv is computed and matches listings_search_idx.';

commit;

analyze public.listings;
