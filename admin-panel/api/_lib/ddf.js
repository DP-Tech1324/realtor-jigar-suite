// CREA DDF® Web API helpers shared by the Ontario sync (admin-panel/api/ddf-sync.js)
// and the live Canada-wide search (client-site/api/ddf-search.js).
// Keep admin-panel/api/_lib/ddf.js and client-site/api/_lib/ddf.js identical.

const TOKEN_URL = 'https://identity.crea.ca/connect/token';
export const DDF_API = 'https://ddfapi.realtor.ca/odata/v1';

export const PROVINCES = {
  'Ontario': 'ON', 'Quebec': 'QC', 'British Columbia': 'BC', 'Alberta': 'AB', 'Manitoba': 'MB',
  'Saskatchewan': 'SK', 'Nova Scotia': 'NS', 'New Brunswick': 'NB', 'Newfoundland & Labrador': 'NL',
  'Newfoundland and Labrador': 'NL', 'Prince Edward Island': 'PE', 'Northwest Territories': 'NT',
  'Yukon': 'YT', 'Nunavut': 'NU',
};
export const PROVINCE_NAMES = {
  ON: 'Ontario', QC: 'Quebec', BC: 'British Columbia', AB: 'Alberta', MB: 'Manitoba', SK: 'Saskatchewan',
  NS: 'Nova Scotia', NB: 'New Brunswick', NL: 'Newfoundland & Labrador', PE: 'Prince Edward Island',
  NT: 'Northwest Territories', YT: 'Yukon', NU: 'Nunavut',
};

// Photos kept per listing, so all of Ontario fits comfortably in the database
const MAX_PHOTOS = 15;

export const odataString = (s) => `'${String(s).replace(/'/g, "''")}'`;

// Tokens last about an hour; reuse one per warm function instance
let cachedToken = { value: null, expires: 0 };
export async function getToken() {
  if (cachedToken.value && Date.now() < cachedToken.expires) return cachedToken.value;
  if (!process.env.DDF_CLIENT_ID || !process.env.DDF_CLIENT_SECRET) {
    throw Object.assign(new Error('DDF_CLIENT_ID and DDF_CLIENT_SECRET are not set in Vercel.'), { status: 500 });
  }
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.DDF_CLIENT_ID,
      client_secret: process.env.DDF_CLIENT_SECRET,
      scope: 'DDFApi_Read',
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw Object.assign(new Error(`CREA login failed (${res.status}): ${data.error_description || data.error || 'no token'}`), { status: 502 });
  }
  cachedToken = { value: data.access_token, expires: Date.now() + ((data.expires_in || 3600) - 120) * 1000 };
  return data.access_token;
}

export async function ddfGet(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!res.ok) {
    throw Object.assign(new Error(`DDF request failed (${res.status}): ${(await res.text()).slice(0, 300)}`), {
      status: res.status === 400 ? 400 : 502,
    });
  }
  return res.json();
}

export function propertyUrl({ filter, orderby, top = 100, skip = 0, select }) {
  const parts = [`$filter=${encodeURIComponent(filter)}`, `$top=${top}`];
  if (orderby) parts.push(`$orderby=${encodeURIComponent(orderby)}`);
  if (skip) parts.push(`$skip=${skip}`);
  if (select) parts.push(`$select=${select}`);
  return `${DDF_API}/Property?${parts.join('&')}`;
}

// Brokerage names for CREA attribution. `known` is a Map of names already looked up.
export async function lookupOffices(token, keys, known = new Map(), limit = 100) {
  const queue = [...keys].filter((k) => !known.has(k)).slice(0, limit);
  const found = new Map();
  const worker = async () => {
    while (queue.length) {
      const key = queue.shift();
      try {
        const page = await ddfGet(token, `${DDF_API}/Office?$filter=${encodeURIComponent(`OfficeKey eq ${odataString(key)}`)}&$top=1`);
        if (page.value?.[0]?.OfficeName) found.set(key, page.value[0].OfficeName);
      } catch {
        // attribution falls back to "a CREA member brokerage"
      }
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));
  return found;
}

function mapPropertyType(item) {
  const text = [item.PropertyType, item.PropertySubType, item.CommonInterest, ...(item.StructureType || [])]
    .filter(Boolean).join(' ').toLowerCase();
  if (/commercial|business|office|retail|industrial|hospitality/.test(text)) return 'commercial';
  if (/vacant|land/.test(text) && !/house|townhouse|apartment/.test(text)) return 'land';
  if (/row|townhouse/.test(text)) return 'townhouse';
  if (/condo|strata|apartment/.test(text)) return 'condo';
  if (/duplex|triplex|fourplex|multi/.test(text)) return 'multi_family';
  return 'single_family';
}

const TYPE_WORDS = {
  single_family: 'House', condo: 'Condo', townhouse: 'Townhouse', multi_family: 'Multi-family home',
  land: 'Land', commercial: 'Commercial property',
};

// One DDF Property record -> listings row (same shape the website reads)
export function toRow(item, { ownKeys = [], offices = new Map() } = {}) {
  const address = item.UnparsedAddress || [item.StreetNumber, item.StreetName, item.StreetSuffix].filter(Boolean).join(' ');
  const city = item.City;
  if (!item.ListingKey || !address || !city) return null;

  const property_type = mapPropertyType(item);
  // Rentals: CREA may mark them by transaction type, or only by sending a lease amount
  const leaseAmount = item.LeaseAmount ?? item.TotalActualRent ?? null;
  const markedLease = /lease|rent/i.test(item.TransactionType || '') && !/sale/i.test(item.TransactionType || '');
  const isRent = markedLease || (!item.ListPrice && !!leaseAmount);
  // Commercial leases are often priced per square foot or per year; only show a monthly figure
  const leaseIsMonthly = !item.LeaseAmountFrequency || /month/i.test(item.LeaseAmountFrequency);
  const monthly = leaseAmount ?? (markedLease ? item.ListPrice : null);
  const rent = isRent && leaseIsMonthly && monthly >= 100 ? monthly : null;
  const beds = item.BedroomsTotal;
  const photos = (item.Media || [])
    .slice()
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .map((m) => m?.MediaURL)
    .filter(Boolean)
    .slice(0, MAX_PHOTOS);
  const area = Number(item.LivingArea || item.AboveGradeFinishedArea || item.BuildingAreaTotal) || null;
  const lot = Number(item.LotSizeArea) || null;
  const officeKey = item.ListOfficeKey ? String(item.ListOfficeKey) : null;

  return {
    listing_key: String(item.ListingKey),
    mls_number: item.ListingId || null,
    listing_url: item.ListingURL ? (item.ListingURL.startsWith('http') ? item.ListingURL : `https://${item.ListingURL}`) : null,
    title: `${beds && !['land', 'commercial'].includes(property_type) ? `${beds} Bed ` : ''}${TYPE_WORDS[property_type]} in ${city}`,
    description: item.PublicRemarks || null,
    address,
    city,
    province: PROVINCES[item.StateOrProvince] || item.StateOrProvince || null,
    postal_code: item.PostalCode || null,
    price: isRent ? rent : (item.ListPrice || null),
    property_type,
    transaction_type: isRent ? 'rent' : 'sale',
    bedrooms: beds ?? null,
    bathrooms: item.BathroomsTotalInteger ?? null,
    square_footage: area ? Math.round(area) : null,
    lot_size: lot && item.LotSizeUnits !== 'acres' ? Math.round(lot) : null,
    year_built: item.YearBuilt || null,
    images: photos,
    cover_image: photos[0] || null,
    latitude: item.Latitude ?? null,
    longitude: item.Longitude ?? null,
    list_agent_key: item.ListAgentKey ? String(item.ListAgentKey) : null,
    list_office_key: officeKey,
    list_office_name: (officeKey && offices.get(officeKey)) || item.ListOfficeName || null,
    is_own_listing: ownKeys.includes(String(item.ListAgentKey)),
    ddf_modified_at: item.ModificationTimestamp || null,
  };
}
