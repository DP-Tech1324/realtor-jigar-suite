// Live CREA DDF® search for listings outside Ontario (Ontario is stored in Supabase by
// admin-panel/api/ddf-sync.js). Returns rows in the same shape as public.listings.
//
//   GET /api/ddf-search?city=Calgary&province=AB&minPrice=&maxPrice=&bedrooms=&bathrooms=&saleType=sale&page=0
//   GET /api/ddf-search?key=<ListingKey>        one listing, for its property page
//
// Env: DDF_CLIENT_ID, DDF_CLIENT_SECRET

import { PROVINCE_NAMES, ddfGet, getToken, lookupOffices, odataString, propertyUrl, toRow } from './_lib/ddf.js';

const PAGE_SIZE = 24;
const offices = new Map(); // brokerage names, kept while the function instance is warm

// Best-effort per-instance limit so one visitor can't exhaust the CREA quota
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 30;
}

// CREA city names are capitalised; keep what the visitor typed unless it's all lower case
const titleCase = (s) => (s.trim() === s.trim().toLowerCase() ? s.trim().replace(/(^|[\s-])\S/g, (c) => c.toUpperCase()) : s.trim());
const num = (v) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : null);

function buildFilter(q) {
  const parts = [];
  if (q.city) parts.push(`City eq ${odataString(titleCase(String(q.city)))}`);
  const provinceName = PROVINCE_NAMES[String(q.province || '').toUpperCase()];
  if (provinceName) parts.push(`StateOrProvince eq ${odataString(provinceName)}`);
  if (!parts.length) return null;

  const rent = q.saleType === 'rent';
  const priceField = rent ? 'LeaseAmount' : 'ListPrice';
  parts.push(`${priceField} gt 0`);
  if (num(q.minPrice) !== null) parts.push(`${priceField} ge ${num(q.minPrice)}`);
  if (num(q.maxPrice) !== null) parts.push(`${priceField} le ${num(q.maxPrice)}`);
  if (num(q.bedrooms) !== null) parts.push(`BedroomsTotal ge ${num(q.bedrooms)}`);
  if (num(q.bathrooms) !== null) parts.push(`BathroomsTotalInteger ge ${num(q.bathrooms)}`);
  return parts.join(' and ');
}

function present(rows) {
  return rows.map((row) => ({
    ...row,
    id: `ddf-${row.listing_key}`,
    source: 'ddf',
    status: 'active',
    is_featured: false,
    live: true,
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many searches, please wait a minute.' });

  try {
    const q = req.query || {};
    const token = await getToken();

    let filter;
    let top = PAGE_SIZE;
    let skip = 0;
    if (q.key) {
      filter = `ListingKey eq ${odataString(q.key)}`;
      top = 1;
    } else {
      filter = buildFilter(q);
      if (!filter) return res.status(400).json({ error: 'Choose a city or province to search.' });
      skip = Math.max(0, Math.min(40, Number(q.page) || 0)) * PAGE_SIZE;
    }

    const page = await ddfGet(token, propertyUrl({ filter, orderby: 'ModificationTimestamp desc', top, skip }));
    const items = page.value ?? [];
    const found = await lookupOffices(token, new Set(items.map((i) => i.ListOfficeKey).filter(Boolean).map(String)), offices, 30);
    found.forEach((name, key) => offices.set(key, name));

    let rows = present(items.map((item) => toRow(item, { offices })).filter(Boolean));
    rows = q.propertyType
      ? rows.filter((r) => r.property_type === q.propertyType)
      : rows.filter((r) => r.property_type !== 'commercial');

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    if (q.key) {
      if (!rows[0]) return res.status(404).json({ error: 'This listing is no longer available.' });
      return res.status(200).json({ listing: rows[0] });
    }
    return res.status(200).json({ listings: rows, hasMore: items.length === top });
  } catch (err) {
    console.error('DDF search error:', err);
    return res.status(err.status === 400 ? 400 : 502).json({ error: 'Live MLS® search is unavailable right now.' });
  }
}
