// One definition of a property search, shared by every search form, the menu and the
// listings page, so they all speak the same URL parameters and match the database.
// Every filter maps to an indexed column (see supabase/migrations/20261114000000_listings_search.sql).

export interface SearchFilters {
  location: string; // city, postal code or MLS® number
  category: '' | 'residential' | 'commercial';
  propertyType: string; // listings.property_type
  saleType: '' | 'sale' | 'rent';
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minSqft: string;
  keywords: string;
  facing: string;
  vastu: string; // "1" = Vastu-friendly (score 7+)
  province: string; // "" / "ON" = stored listings; other codes = live CREA search
  featured: string; // "1" = featured listings only
}

export const EMPTY_FILTERS: SearchFilters = {
  location: '', category: '', propertyType: '', saleType: '', minPrice: '', maxPrice: '',
  bedrooms: '', bathrooms: '', minSqft: '', keywords: '', facing: '', vastu: '', province: '', featured: '',
};

export const RESIDENTIAL_TYPES = [
  { value: 'single_family', label: 'House (detached / semi)' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo / Apartment' },
  { value: 'multi_family', label: 'Multi-family' },
  { value: 'land', label: 'Land / Lot' },
];
export const PROPERTY_TYPES = [...RESIDENTIAL_TYPES, { value: 'commercial', label: 'Commercial' }];

export const PROVINCE_LABELS: Record<string, string> = {
  ON: 'Ontario', AB: 'Alberta', BC: 'British Columbia', QC: 'Quebec', MB: 'Manitoba', SK: 'Saskatchewan',
  NS: 'Nova Scotia', NB: 'New Brunswick', NL: 'Newfoundland & Labrador', PE: 'Prince Edward Island',
  NT: 'Northwest Territories', YT: 'Yukon', NU: 'Nunavut',
};

// What the location box contains
const POSTAL = /^[A-Za-z]\d[A-Za-z](\s?\d([A-Za-z]\d?)?)?$/; // L6Y, L6Y 1, L6Y 1A1
const MLS = /^[A-Za-z]?\d{6,9}$/; // W1234567, X13561974, 40612345
export function locationKind(value: string): 'postal' | 'mls' | 'city' | '' {
  const v = value.trim();
  if (!v) return '';
  if (POSTAL.test(v)) return 'postal';
  if (MLS.test(v)) return 'mls';
  return 'city';
}

const pick = (params: URLSearchParams, ...keys: string[]) =>
  keys.map((k) => params.get(k)).find((v) => v !== null && v !== '') ?? '';

export function parseSearch(search: string): SearchFilters {
  const p = new URLSearchParams(search);
  const category = pick(p, 'category', 'type');
  const propertyType = pick(p, 'propertyType');
  return {
    // older links use city / postal_code / mls / address
    location: pick(p, 'location', 'city', 'postal_code', 'mls'),
    category: category === 'commercial' || propertyType === 'commercial' ? 'commercial' : category === 'residential' ? 'residential' : '',
    propertyType,
    saleType: (['sale', 'rent'].includes(pick(p, 'saleType')) ? pick(p, 'saleType') : '') as SearchFilters['saleType'],
    minPrice: pick(p, 'minPrice'),
    maxPrice: pick(p, 'maxPrice'),
    bedrooms: pick(p, 'bedrooms'),
    bathrooms: pick(p, 'bathrooms'),
    minSqft: pick(p, 'minSqft', 'sqft'),
    keywords: [pick(p, 'keywords'), pick(p, 'address')].filter(Boolean).join(' '),
    facing: pick(p, 'facing'),
    vastu: pick(p, 'vastu'),
    province: pick(p, 'province').toUpperCase(),
    featured: pick(p, 'featured'),
  };
}

export function searchUrl(filters: Partial<SearchFilters>): string {
  const qs = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined && v !== null) as [string, string][],
  ).toString();
  return qs ? `/listings?${qs}` : '/listings';
}

export const isLiveSearch = (f: SearchFilters) => !!f.province && f.province !== 'ON';

// Applies filters to a Supabase query on public.listings (stored Ontario + manual listings)
export function applyFilters<Q>(query: Q, f: SearchFilters): Q {
  let q: any = query;
  q = q.neq('status', 'draft');

  const where = f.location.trim();
  const kind = locationKind(where);

  // An exact MLS® number finds the listing whatever its type
  if (f.propertyType) q = q.eq('property_type', f.propertyType);
  else if (f.category === 'commercial') q = q.eq('property_type', 'commercial');
  else if (kind !== 'mls') q = q.neq('property_type', 'commercial'); // homes unless commercial is asked for

  if (kind === 'postal') q = q.like('postal_compact', `${where.replace(/\s/g, '').toUpperCase()}%`);
  else if (kind === 'mls') q = q.eq('mls_number', where.toUpperCase());
  else if (kind === 'city') q = q.eq('city_base', where.toLowerCase().split('(')[0].trim());

  if (f.saleType) q = q.eq('transaction_type', f.saleType);
  if (Number(f.minPrice) > 0) q = q.gte('price', Number(f.minPrice));
  if (Number(f.maxPrice) > 0) q = q.lte('price', Number(f.maxPrice));
  if (Number(f.bedrooms) > 0) q = q.gte('bedrooms', Number(f.bedrooms));
  if (Number(f.bathrooms) > 0) q = q.gte('bathrooms', Number(f.bathrooms));
  if (Number(f.minSqft) > 0) q = q.gte('square_footage', Number(f.minSqft));
  if (f.keywords.trim()) q = q.textSearch('search_tsv', f.keywords.trim(), { type: 'websearch', config: 'english' });
  if (f.facing) q = q.eq('facing', f.facing);
  if (f.vastu) q = q.gte('vastu_score', 7);
  if (f.featured) q = q.eq('is_featured', true);
  return q as Q;
}

// Parameters for the live CREA search (client-site/api/ddf-search.js)
export function liveParams(f: SearchFilters, page: number): Record<string, string> {
  return {
    city: locationKind(f.location) === 'city' ? f.location.trim() : '',
    province: isLiveSearch(f) ? f.province : '',
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    bedrooms: f.bedrooms,
    bathrooms: f.bathrooms,
    saleType: f.saleType,
    propertyType: f.propertyType || (f.category === 'commercial' ? 'commercial' : ''),
    page: String(page),
  };
}

// Short human summary for the results line, e.g. "Condos for rent in Brampton"
export function describeSearch(f: SearchFilters): string {
  const type = PROPERTY_TYPES.find((t) => t.value === f.propertyType)?.label
    ?? (f.category === 'commercial' ? 'Commercial properties' : 'Homes');
  const deal = f.saleType === 'rent' ? ' for rent' : f.saleType === 'sale' ? ' for sale' : '';
  if (locationKind(f.location) === 'mls') return `MLS® ${f.location.trim().toUpperCase()}`;
  const place = f.location ? ` in ${f.location}` : isLiveSearch(f) ? ` in ${PROVINCE_LABELS[f.province]}` : '';
  return `${f.featured ? 'Featured: ' : ''}${type}${deal}${place}`;
}
