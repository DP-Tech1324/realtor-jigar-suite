-- Record what the AI Vastu estimates cover, so future work knows what to add next.
comment on table public.listing_vastu_ai is
  'AI Vastu estimates read from MLS(R) floor-plan photos (client-site/api/vastu-check.js). '
  'SCOPE (Nov 2026): Ontario only (province ON) and residential only (property_type single_family, '
  'townhouse, condo, multi_family). NOT YET INCLUDED: commercial and land (no residential room layout); '
  'listings outside Ontario (searched live from CREA, not stored) get "Request a Vastu report" instead. '
  'To widen: update SCOPE_* in client-site/api/vastu-check.js, VASTU_AI_SCOPE in '
  'client-site/src/lib/vastuScope.ts, and this comment. Jigar-verified Vastu stays in listings.vastu.';
