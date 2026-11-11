// CREA DDF® (MLS®) sync (Vercel serverless function + daily cron, see vercel.json).
//
//   GET  /api/ddf-sync                      cron run (Authorization: Bearer CRON_SECRET)
//   POST /api/ddf-sync                      "Sync MLS now" from the admin panel (staff token)
//   POST /api/ddf-sync { find_agent: "Jigar Patel" }   look up agent keys for DDF_AGENT_KEYS
//
// Fetches Jigar's own listings (DDF_AGENT_KEYS) plus the newest listings in DDF_CITIES,
// writes them to public.listings via upsert_ddf_listings(), then removes feed listings
// that are no longer in the feed.
//
// Env: DDF_CLIENT_ID, DDF_CLIENT_SECRET, DDF_AGENT_KEYS (comma separated),
//      DDF_CITIES (comma separated, default GTA), DDF_MAX_LISTINGS (default 500),
//      CRON_SECRET, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js';

const TOKEN_URL = 'https://identity.crea.ca/connect/token';
const API = 'https://ddfapi.realtor.ca/odata/v1';
const STAFF_ROLES = ['superadmin', 'admin', 'editor'];
const DEFAULT_CITIES = 'Toronto,Brampton,Mississauga,Vaughan,Markham,Richmond Hill,Oakville,Milton,Caledon';
const PAGE_SIZE = 100;

const list = (value, fallback = '') =>
  (value || fallback).split(',').map((s) => s.trim()).filter(Boolean);
const odataString = (s) => `'${String(s).replace(/'/g, "''")}'`;

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const raw = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
  return JSON.parse(raw || '{}');
}

async function isAuthorized(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  if (process.env.CRON_SECRET && token === process.env.CRON_SECRET) return true;
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.rpc('get_current_user_role');
  return !error && STAFF_ROLES.includes(data);
}

async function getToken() {
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
  return data.access_token;
}

async function ddfGet(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!res.ok) {
    throw Object.assign(new Error(`DDF request failed (${res.status}): ${(await res.text()).slice(0, 300)}`), { status: 502 });
  }
  return res.json();
}

// Follows @odata.nextLink (or $skip) until `max` records or the end of the results
async function fetchProperties(token, filter, max) {
  const out = [];
  let url = `${API}/Property?$filter=${encodeURIComponent(filter)}&$orderby=ModificationTimestamp desc&$top=${Math.min(PAGE_SIZE, max)}`;
  let skip = 0;
  while (url && out.length < max) {
    const page = await ddfGet(token, url);
    const batch = page.value ?? [];
    out.push(...batch);
    if (page['@odata.nextLink']) {
      url = page['@odata.nextLink'];
    } else if (batch.length === PAGE_SIZE) {
      skip += PAGE_SIZE;
      url = `${API}/Property?$filter=${encodeURIComponent(filter)}&$orderby=ModificationTimestamp desc&$top=${PAGE_SIZE}&$skip=${skip}`;
    } else {
      url = null;
    }
  }
  return out.slice(0, max);
}

// Brokerage names for CREA attribution, looked up once per office
async function officeNames(token, keys) {
  const names = new Map();
  const queue = [...keys].slice(0, 300);
  const worker = async () => {
    while (queue.length) {
      const key = queue.shift();
      try {
        const page = await ddfGet(token, `${API}/Office?$filter=${encodeURIComponent(`OfficeKey eq ${odataString(key)}`)}&$top=1`);
        if (page.value?.[0]?.OfficeName) names.set(key, page.value[0].OfficeName);
      } catch {
        // attribution falls back to the listing's own office name field, if any
      }
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));
  return names;
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

function toRow(item, ownKeys, offices) {
  const address = item.UnparsedAddress || [item.StreetNumber, item.StreetName, item.StreetSuffix].filter(Boolean).join(' ');
  const city = item.City;
  if (!item.ListingKey || !address || !city) return null;

  const property_type = mapPropertyType(item);
  const isRent = !item.ListPrice && !!item.LeaseAmount;
  const beds = item.BedroomsTotal;
  const photos = (item.Media || [])
    .slice()
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .map((m) => m?.MediaURL)
    .filter(Boolean);
  const area = Number(item.LivingArea || item.AboveGradeFinishedArea || item.BuildingAreaTotal) || null;
  const lot = Number(item.LotSizeArea) || null;

  return {
    listing_key: String(item.ListingKey),
    mls_number: item.ListingId || null,
    listing_url: item.ListingURL ? (item.ListingURL.startsWith('http') ? item.ListingURL : `https://${item.ListingURL}`) : null,
    title: `${beds && !['land', 'commercial'].includes(property_type) ? `${beds} Bed ` : ''}${TYPE_WORDS[property_type]} in ${city}`,
    description: item.PublicRemarks || null,
    address,
    city,
    province: item.StateOrProvince === 'Ontario' ? 'ON' : (item.StateOrProvince || 'ON'),
    postal_code: item.PostalCode || null,
    price: isRent ? item.LeaseAmount : (item.ListPrice || null),
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
    list_office_key: item.ListOfficeKey ? String(item.ListOfficeKey) : null,
    list_office_name: offices.get(String(item.ListOfficeKey)) || item.ListOfficeName || null,
    is_own_listing: ownKeys.includes(String(item.ListAgentKey)),
    ddf_modified_at: item.ModificationTimestamp || null,
  };
}

async function findAgent(token, name) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.join(' ');
  const filter = last
    ? `MemberFirstName eq ${odataString(first)} and MemberLastName eq ${odataString(last)}`
    : `MemberLastName eq ${odataString(first)}`;
  const page = await ddfGet(token, `${API}/Member?$filter=${encodeURIComponent(filter)}&$top=25`);
  const members = page.value ?? [];
  const offices = await officeNames(token, new Set(members.map((m) => m.OfficeKey).filter(Boolean).map(String)));
  return members.map((m) => ({
    agent_key: m.MemberKey,
    name: [m.MemberFirstName, m.MemberLastName].filter(Boolean).join(' '),
    city: m.MemberCity || null,
    office: offices.get(String(m.OfficeKey)) || null,
  }));
}

async function sync() {
  const started = new Date();
  const token = await getToken();
  const ownKeys = list(process.env.DDF_AGENT_KEYS);
  const cities = list(process.env.DDF_CITIES, DEFAULT_CITIES);
  const max = Number(process.env.DDF_MAX_LISTINGS) || 500;

  const own = ownKeys.length
    ? await fetchProperties(token, ownKeys.map((k) => `ListAgentKey eq ${odataString(k)}`).join(' or '), 200)
    : [];
  const pool = cities.length
    ? await fetchProperties(token, `(${cities.map((c) => `City eq ${odataString(c)}`).join(' or ')})`, max)
    : [];

  const byKey = new Map();
  [...own, ...pool].forEach((item) => byKey.set(String(item.ListingKey), item));
  const officeKeys = new Set([...byKey.values()].map((i) => i.ListOfficeKey).filter(Boolean).map(String));
  const offices = await officeNames(token, officeKeys);
  const rows = [...byKey.values()].map((item) => toRow(item, ownKeys, offices)).filter(Boolean);

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  let upserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const { data, error } = await supabase.rpc('upsert_ddf_listings', { rows: rows.slice(i, i + 200) });
    if (error) throw Object.assign(new Error(`Database write failed: ${error.message}`), { status: 500 });
    upserted += data || 0;
  }

  // Only prune after a complete, successful fetch, so a CREA outage never empties the site
  const { data: removed, error } = await supabase.rpc('remove_stale_ddf_listings', { synced_before: started.toISOString() });
  if (error) throw Object.assign(new Error(`Cleanup failed: ${error.message}`), { status: 500 });

  return {
    own_listings: own.length,
    area_listings: pool.length,
    saved: upserted,
    removed: removed || 0,
    agent_keys_set: ownKeys.length > 0,
    seconds: Math.round((Date.now() - started.getTime()) / 1000),
  };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!(await isAuthorized(req))) return res.status(401).json({ error: 'Not authorized.' });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set in Vercel.' });
    }
    const body = req.method === 'POST' ? await readBody(req) : {};
    if (body.find_agent) {
      const token = await getToken();
      return res.status(200).json({ matches: await findAgent(token, body.find_agent) });
    }
    const result = await sync();
    console.log('DDF sync complete', result);
    return res.status(200).json(result);
  } catch (err) {
    console.error('DDF sync error:', err);
    return res.status(err.status || 500).json({ error: err.message || 'DDF sync failed' });
  }
}
