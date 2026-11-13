// CREA DDF® (MLS®) sync for all of Ontario (Vercel serverless function + cron, see vercel.json).
//
//   GET  /api/ddf-sync                      cron run (Authorization: Bearer CRON_SECRET)
//   POST /api/ddf-sync                      "Sync now" from the admin panel (staff token)
//   POST /api/ddf-sync { find_agent: "Jigar Patel" }   look up agent keys for DDF_AGENT_KEYS
//
// Each run works for up to ~4 minutes and can be repeated until `more` is false:
//   1. Jigar's own listings (DDF_AGENT_KEYS, any province): refreshed every run.
//   2. Ontario changes: everything modified since the newest listing already stored,
//      oldest first, upserted page by page. The first runs load all of Ontario.
//   3. Daily "still in the feed?" pass over Ontario listing keys (resumable); when it
//      completes, listings it never saw are removed.
// Listings outside Ontario are not stored; client-site/api/ddf-search.js searches them live.
//
// Env: DDF_CLIENT_ID, DDF_CLIENT_SECRET, DDF_AGENT_KEYS (comma separated), DDF_PROVINCE (default Ontario),
//      CRON_SECRET, SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY), VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js';
import { DDF_API, PROVINCES, ddfGet, getToken, lookupOffices, odataString, propertyUrl, toRow } from './_lib/ddf.js';

const STAFF_ROLES = ['superadmin', 'admin', 'editor'];
// Either name works; the Vercel project uses SERVICE_ROLE_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const TIME_BUDGET_MS = 240_000; // stay well inside the 300 s function limit
const RECONCILE_EVERY_MS = 20 * 60 * 60 * 1000;

const list = (value) => (value || '').split(',').map((s) => s.trim()).filter(Boolean);

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
  // A short value is a placeholder, never a usable secret
  const cronSecret = process.env.CRON_SECRET || '';
  if (cronSecret.length >= 24 && token === cronSecret) return true;
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.rpc('get_current_user_role');
  return !error && STAFF_ROLES.includes(data);
}

function check(result, what) {
  if (result.error) throw Object.assign(new Error(`${what}: ${result.error.message}`), { status: 500 });
  return result.data;
}

async function findAgent(token, name) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.join(' ');
  const filter = last
    ? `MemberFirstName eq ${odataString(first)} and MemberLastName eq ${odataString(last)}`
    : `MemberLastName eq ${odataString(first)}`;
  const page = await ddfGet(token, `${DDF_API}/Member?$filter=${encodeURIComponent(filter)}&$top=25`);
  const members = page.value ?? [];
  const offices = await lookupOffices(token, new Set(members.map((m) => m.OfficeKey).filter(Boolean).map(String)));
  return members.map((m) => ({
    agent_key: m.MemberKey,
    name: [m.MemberFirstName, m.MemberLastName].filter(Boolean).join(' '),
    city: m.MemberCity || null,
    office: offices.get(String(m.OfficeKey)) || null,
  }));
}

async function sync() {
  const started = Date.now();
  const timeLeft = () => TIME_BUDGET_MS - (Date.now() - started);
  const token = await getToken();
  const ownKeys = list(process.env.DDF_AGENT_KEYS);
  const provinceName = process.env.DDF_PROVINCE || 'Ontario';
  const provinceCode = PROVINCES[provinceName] || provinceName;
  const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const stats = { own_listings: 0, updated: 0, checked: 0, removed: 0, offices_added: 0 };
  const newOfficeKeys = [];
  let loggedNoPrice = 0;

  // Brokerage names already known
  const officeRows = check(await supabase.from('ddf_offices').select('office_key, office_name'), 'Loading offices');
  const offices = new Map(officeRows.map((o) => [o.office_key, o.office_name]));

  const save = async (items) => {
    const newOffices = await lookupOffices(token, new Set(items.map((i) => i.ListOfficeKey).filter(Boolean).map(String)), offices);
    if (newOffices.size) {
      const rows = [...newOffices].map(([office_key, office_name]) => ({ office_key, office_name }));
      check(await supabase.from('ddf_offices').upsert(rows), 'Saving offices');
      newOffices.forEach((name, key) => { offices.set(key, name); newOfficeKeys.push(key); });
      stats.offices_added += newOffices.size;
    }
    // Evidence for the rental mapping: price/lease fields of a few listings with no list price
    if (loggedNoPrice < 3) {
      for (const item of items.filter((i) => !i.ListPrice).slice(0, 3 - loggedNoPrice)) {
        console.log('DDF no-price sample', JSON.stringify(Object.fromEntries(
          Object.entries(item).filter(([k]) => /price|lease|rent|transaction|sub ?type|structure/i.test(k)),
        )));
        loggedNoPrice++;
      }
    }
    const rows = items.map((item) => toRow(item, { ownKeys, offices })).filter(Boolean);
    if (rows.length) stats.updated += check(await supabase.rpc('upsert_ddf_listings', { rows }), 'Saving listings') || 0;
  };

  // Where the Ontario load left off. Kept in ddf_sync_state rather than taken from the newest stored
  // listing: Jigar's own listings (refreshed every run) or listings saved by an earlier, partial sync
  // would otherwise make the load skip every older Ontario listing.
  const state = check(await supabase.from('ddf_sync_state').select('*').eq('id', 1).single(), 'Reading sync state');
  const since = state.incremental_cursor;
  const saveCursor = async (cursor) => check(
    await supabase.from('ddf_sync_state').update({ incremental_cursor: cursor, updated_at: new Date().toISOString() }).eq('id', 1),
    'Saving sync position',
  );

  // 1. Jigar's own listings, wherever they are
  if (ownKeys.length) {
    const own = [];
    let url = propertyUrl({ filter: ownKeys.map((k) => `ListAgentKey eq ${odataString(k)}`).join(' or ') });
    while (url) {
      const page = await ddfGet(token, url);
      own.push(...(page.value ?? []));
      url = page['@odata.nextLink'] || null;
    }
    await save(own);
    check(await supabase.rpc('remove_missing_own_listings', { keys: own.map((i) => String(i.ListingKey)) }), 'Own listings cleanup');
    stats.own_listings = own.length;
  }

  // 2. Ontario changes since the newest listing we already have (all of Ontario on the first runs)
  let filter = `StateOrProvince eq ${odataString(provinceName)}`;
  if (since) filter += ` and ModificationTimestamp ge ${new Date(since).toISOString()}`;
  let url = propertyUrl({ filter, orderby: 'ModificationTimestamp asc' });
  let caughtUp = false;
  while (timeLeft() > 30_000) {
    const page = await ddfGet(token, url);
    const items = page.value ?? [];
    await save(items);
    // Pages come oldest first, so the last item is how far the load has got
    const reached = items[items.length - 1]?.ModificationTimestamp;
    if (reached) await saveCursor(reached);
    url = page['@odata.nextLink'];
    if (!url) { caughtUp = true; break; }
  }

  // 3. Daily pass over every Ontario listing key, to drop sold/expired listings
  let reconcilePending = false;
  if (caughtUp && timeLeft() > 30_000) {
    const due = !state.reconcile_completed_at || Date.now() - new Date(state.reconcile_completed_at).getTime() > RECONCILE_EVERY_MS;
    if (state.reconcile_next_url || due) {
      let next = state.reconcile_next_url;
      let passStarted = state.reconcile_started_at;
      if (!next) {
        passStarted = new Date().toISOString();
        next = propertyUrl({ filter: `StateOrProvince eq ${odataString(provinceName)}`, select: 'ListingKey' });
      }
      let completed = false;
      while (next && timeLeft() > 20_000) {
        let page;
        try {
          page = await ddfGet(token, next);
        } catch (err) {
          // A stale continuation link restarts the pass next run instead of failing the sync
          if (err.status === 400) { next = null; break; }
          throw err;
        }
        const keys = (page.value ?? []).map((i) => String(i.ListingKey));
        if (keys.length) check(await supabase.rpc('touch_ddf_listings', { keys }), 'Marking listings');
        stats.checked += keys.length;
        next = page['@odata.nextLink'] || null;
        completed = !next;
      }

      if (completed) {
        // Pass complete: anything in Ontario it didn't see has left the feed
        stats.removed = check(
          await supabase.rpc('remove_unseen_ddf_listings', { seen_since: passStarted, province_code: provinceCode }),
          'Removing old listings',
        ) || 0;
      }
      check(await supabase.from('ddf_sync_state').update({
        reconcile_next_url: next,
        reconcile_started_at: next ? passStarted : null,
        ...(completed ? { reconcile_completed_at: new Date().toISOString() } : {}),
        updated_at: new Date().toISOString(),
      }).eq('id', 1), 'Saving sync state');
      reconcilePending = !!next;
    }
  }

  // Listings saved before their office name was known; never fail a run over this
  if (newOfficeKeys.length) {
    const { error } = await supabase.rpc('fill_ddf_office_names', { keys: newOfficeKeys });
    if (error) console.warn('Filling brokerage names skipped:', error.message);
  }

  return {
    ...stats,
    more: !caughtUp || reconcilePending,
    phase: !caughtUp ? 'loading Ontario listings' : reconcilePending ? 'checking for removed listings' : 'up to date',
    agent_keys_set: ownKeys.length > 0,
    seconds: Math.round((Date.now() - started) / 1000),
  };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!(await isAuthorized(req))) return res.status(401).json({ error: 'Not authorized.' });
    if (!SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'SERVICE_ROLE_KEY (Supabase service_role key) is not set in Vercel.' });
    }
    const body = req.method === 'POST' ? await readBody(req) : {};
    if (body.find_agent) {
      const token = await getToken();
      return res.status(200).json({ matches: await findAgent(token, body.find_agent) });
    }
    const result = await sync();
    console.log('DDF sync', result);
    return res.status(200).json(result);
  } catch (err) {
    console.error('DDF sync error:', err);
    return res.status(err.status && err.status < 600 ? err.status : 500).json({ error: err.message || 'DDF sync failed' });
  }
}
