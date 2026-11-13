-- Rental searches: rentals are a small share of listings, so "newest homes first" had to
-- read past every sale to find them (rent + 2 beds timed out). Index rentals on their own.
create index if not exists listings_home_rentals_recent_idx
  on public.listings (created_at desc)
  where status <> 'draft' and property_type <> 'commercial' and transaction_type = 'rent';
