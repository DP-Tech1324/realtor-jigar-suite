-- Public listing search goes through this view instead of the table.
--
-- Why: on a table with row-level security, Postgres won't use column statistics for
-- comparisons that aren't "leakproof" (numeric price/bathrooms ranges, postal prefix LIKE,
-- full-text @@). Searches run as the visitor role were estimated at 1 row and planned
-- as full scans (7–12 s, timeouts). The view is owned by the table owner, so the planner
-- uses real statistics; it exposes exactly what the "listings public read" policy allows
-- visitors to see (everything except drafts) and is read-only for them.

create or replace view public.listings_public as
  select * from public.listings where status <> 'draft';

revoke all on public.listings_public from anon, authenticated;
grant select on public.listings_public to anon, authenticated;

comment on view public.listings_public is
  'Non-draft listings for public search. Same rows the RLS policy shows visitors; avoids RLS planner limits.';
