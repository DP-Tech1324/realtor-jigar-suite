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

// Full CREA record -> the grouped facts a property page shows (summary, building, land and
// parking, rooms). Fetched live per page view instead of stored, so it costs no database space.
const joined = (v) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : v) || null;
const money = (n) => (n ? `$${Math.round(n).toLocaleString('en-CA')}` : null);
function unitLabel(u = '') {
  if (/square ?f(ee)?t|sq ?ft/i.test(u)) return 'sqft';
  if (/square ?met|sq ?m/i.test(u)) return 'm²';
  if (/acre/i.test(u)) return 'acres';
  if (/hectare/i.test(u)) return 'ha';
  if (/feet|foot|ft/i.test(u)) return 'ft';
  if (/met/i.test(u)) return 'm';
  return u;
}
const measure = (n, unit) => (Number(n) ? `${Number(n).toLocaleString('en-CA')} ${unitLabel(unit)}`.trim() : null);
function feetInches(feet) {
  let f = Math.floor(feet);
  let i = Math.round((feet - f) * 12);
  if (i === 12) { f += 1; i = 0; }
  return `${f}' ${i}"`;
}
const facts = (pairs) => pairs
  .filter(([, v]) => v !== null && v !== undefined && v !== '')
  .map(([label, value]) => ({ label, value: String(value) }));

function toRoom(r) {
  const units = r.RoomLengthWidthUnits || '';
  const toMetres = /met|^m$/i.test(units) ? 1 : /feet|foot|ft/i.test(units) ? 0.3048 : null;
  const sized = toMetres && Number(r.RoomLength) && Number(r.RoomWidth);
  const m = sized ? [r.RoomLength * toMetres, r.RoomWidth * toMetres] : null;
  return {
    type: r.RoomType || 'Room',
    level: r.RoomLevel || null,
    metric: m ? `${m[0].toFixed(2)} m x ${m[1].toFixed(2)} m` : null,
    imperial: m ? `${feetInches(m[0] / 0.3048)} x ${feetInches(m[1] / 0.3048)}` : null,
    dimensions: r.RoomDimensions || null,
    description: r.RoomDescription || null,
  };
}

export function toDetails(item) {
  const fee = item.AssociationFee
    ? `${money(item.AssociationFee)}${item.AssociationFeeFrequency ? ` / ${String(item.AssociationFeeFrequency).toLowerCase()}` : ''}`
    : null;
  const tax = item.TaxAnnualAmount ? `${money(item.TaxAnnualAmount)}${item.TaxYear ? ` (${item.TaxYear})` : ''}` : null;
  const bedrooms = item.BedroomsAboveGrade != null || item.BedroomsBelowGrade != null
    ? `${item.BedroomsAboveGrade ?? 0} above grade${item.BedroomsBelowGrade ? ` + ${item.BedroomsBelowGrade} below grade` : ''}`
    : null;
  const bathrooms = item.BathroomsTotalInteger != null
    ? `${item.BathroomsTotalInteger}${item.BathroomsPartial ? ` (${item.BathroomsPartial} partial)` : ''}`
    : null;
  const fireplace = item.FireplacesTotal
    ? [item.FireplacesTotal, joined(item.FireplaceFeatures)].filter(Boolean).join(' · ')
    : item.FireplaceYN === true ? 'Yes' : null;

  return {
    summary: facts([
      ['Property type', item.PropertySubType],
      ['Building type', joined(item.StructureType)],
      ['Ownership', item.CommonInterest],
      ['Storeys', item.Stories],
      ['Neighbourhood', item.SubdivisionName || item.CityRegion],
      ['Annual property taxes', tax],
      ['Maintenance fee', fee],
      ['Fee includes', joined(item.AssociationFeeIncludes)],
      ['Available', item.AvailabilityDate ? String(item.AvailabilityDate).slice(0, 10) : null],
      ['Directions', item.Directions],
      ['Real estate board', item.ListAOR],
    ]),
    building: facts([
      ['Architectural style', joined(item.ArchitecturalStyle)],
      ['Bedrooms', bedrooms],
      ['Bathrooms', bathrooms],
      ['Interior size', measure(item.LivingArea || item.AboveGradeFinishedArea, item.LivingAreaUnits || item.AboveGradeFinishedAreaUnits)],
      ['Finished below grade', measure(item.BelowGradeFinishedArea, item.BelowGradeFinishedAreaUnits)],
      ['Building area', measure(item.BuildingAreaTotal, item.BuildingAreaUnits)],
      ['Basement', joined(item.Basement)],
      ['Foundation', joined(item.FoundationDetails)],
      ['Exterior finish', joined(item.ConstructionMaterials)],
      ['Exterior features', joined(item.ExteriorFeatures)],
      ['Roof', joined(item.Roof)],
      ['Flooring', joined(item.Flooring)],
      ['Heating', joined(item.Heating)],
      ['Cooling', joined(item.Cooling)],
      ['Fireplace', fireplace],
      ['Appliances included', joined(item.Appliances)],
      ['Building features', joined(item.BuildingFeatures)],
      ['Accessibility', joined(item.AccessibilityFeatures)],
      ['Security', joined(item.SecurityFeatures)],
      ['Condition', joined(item.PropertyCondition)],
      ['Year built', item.YearBuilt],
    ]),
    land: facts([
      ['Lot size', item.LotSizeDimensions || measure(item.LotSizeArea, item.LotSizeUnits)],
      ['Frontage', measure(item.FrontageLengthNumeric, item.FrontageLengthNumericUnits)],
      ['Lot features', joined(item.LotFeatures)],
      ['Parking', joined(item.ParkingFeatures)],
      ['Parking spaces', item.ParkingTotal],
      ['Fencing', joined(item.Fencing)],
      ['Pool', joined(item.PoolFeatures)],
      ['View', joined(item.View)],
      ['Waterfront', joined(item.WaterfrontFeatures)],
      ['Water body', item.WaterBodyName],
      ['Community features', joined(item.CommunityFeatures)],
      ['Zoning', item.ZoningDescription || item.Zoning],
      ['Sewer', joined(item.Sewer)],
      ['Water', joined(item.WaterSource)],
      ['Utilities', joined(item.Utilities)],
      ['Electric', joined(item.Electric)],
      ['Road', joined(item.RoadSurfaceType)],
      ['Business type', joined(item.BusinessType)],
      ['Current use', joined(item.CurrentUse)],
      ['Possible use', joined(item.PossibleUse)],
      ['Units', item.NumberOfUnitsTotal],
      ['Buildings', item.NumberOfBuildings],
    ]),
    rooms: (item.Rooms || []).map(toRoom),
    inclusions: item.Inclusions || null,
  };
}
