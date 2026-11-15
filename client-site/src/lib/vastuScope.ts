// Which listings get the AI Vastu check (see client-site/api/vastu-check.js, which enforces
// the same list, and the comment on public.listing_vastu_ai). Widen these lists to add more.
//
// Included now: Ontario residential homes, the ones with floor plans and rooms to map.
// Not yet: commercial and land (no residential room layout), and listings outside Ontario
// (searched live, not stored), which get "Request a Vastu report" instead.
export const VASTU_AI_SCOPE = {
  provinces: ['ON'],
  propertyTypes: ['single_family', 'townhouse', 'condo', 'multi_family'],
};

export const isVastuResidential = (propertyType?: string | null) =>
  !!propertyType && VASTU_AI_SCOPE.propertyTypes.includes(propertyType);

export const isVastuAiEligible = (listing: { property_type?: string | null; province?: string | null; live?: boolean }) =>
  !listing.live && isVastuResidential(listing.property_type) && VASTU_AI_SCOPE.provinces.includes(listing.province || '');
