// AI Vastu check for one stored MLS® listing (Vercel serverless function), answered by Claude.
// POST /api/vastu-check { listing_id }  ->  { estimate }   (cached in listing_vastu_ai)
//
// Claude looks through the listing's photos for a floor plan and fills the same 9-zone layout
// Jigar uses in the admin Vastu tab. Each listing is analysed once; repeat visits read the cache.
//
// Env: ANTHROPIC_API_KEY, VITE_SUPABASE_URL, SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY),
//      VASTU_DAILY_LIMIT (new analyses per day across the site, default 150)

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const MODEL = 'claude-opus-5-5';
const MAX_PHOTOS = 12;
const ZONES = ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'];
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const ROOMS = [
  'living', 'kitchen', 'master_bedroom', 'bedroom', 'pooja', 'dining',
  'bathroom', 'staircase', 'study', 'garage', 'open', 'other', 'none',
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const client = new Anthropic();
const db = () => createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

// Best-effort per-instance limit: a few checks per visitor per hour
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

// Download photos here so one broken link can't fail the whole request
async function loadPhotos(urls) {
  const photos = await Promise.all(urls.slice(0, MAX_PHOTOS).map(async (url) => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const type = (res.headers.get('content-type') || '').split(';')[0];
      if (!res.ok || !/^image\/(jpeg|png|webp|gif)$/.test(type)) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 4.5 * 1024 * 1024) return null;
      return { type: 'image', source: { type: 'base64', media_type: type, data: buf.toString('base64') } };
    } catch {
      return null;
    }
  }));
  return photos.filter(Boolean);
}

async function analyse(listing, photos) {
  const zoneProps = Object.fromEntries(ZONES.map((z) => [z, { type: 'string', enum: ROOMS }]));
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      effort: 'high',
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['floor_plan_found', 'facing', 'zones', 'confidence', 'notes'],
          properties: {
            floor_plan_found: { type: 'boolean' },
            facing: { type: 'string', enum: [...DIRECTIONS, 'unknown'] },
            zones: { type: 'object', additionalProperties: false, required: ZONES, properties: zoneProps },
            confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
            notes: { type: 'string' },
          },
        },
      },
    },
    system: `You read real estate listing photos for Vastu Shastra analysis for a GTA realtor's website.
Be honest about uncertainty: these estimates are shown to home buyers as "AI estimate, confirm with the agent".
Never invent rooms you cannot see on a floor plan.`,
    messages: [{
      role: 'user',
      content: [
        ...photos,
        {
          type: 'text',
          text: `These are the photos of an MLS® listing: ${listing.title}, ${listing.address}, ${listing.city}.
Listing description (may mention orientation): ${(listing.description || '').slice(0, 3000)}

1. floor_plan_found: true only if one of the photos is an actual floor plan drawing of the home's layout.
2. If there is a floor plan: use a north arrow or compass on it if present; otherwise assume the top of the plan is north and say so in notes. Split the main floor footprint into a 3x3 grid (NW, N, NE / W, C, E / SW, S, SE) and give the main room in each zone: ${ROOMS.join(', ')}. "bathroom" = any washroom, "open" = open area, "none" = outside the home or unclear. If several rooms share a zone, pick the most significant for Vastu (kitchen, pooja, master bedroom, washroom or staircase over hallways). Use "master_bedroom" for the primary bedroom (often upstairs; include it if an upper-floor plan shows it).
3. If there is no floor plan: set every zone to "none".
4. facing: the direction the main entrance faces, from the plan or an explicit statement in the description about the front of the house (ignore "south-facing backyard" or windows). Otherwise "unknown".
5. confidence: how sure you are of the zones and facing overall.
6. notes: one or two plain sentences for the buyer: what you based this on and what to double-check.`,
        },
      ],
    }],
  });

  if (response.stop_reason === 'refusal') throw Object.assign(new Error('The AI declined to analyse this listing.'), { status: 422 });
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return JSON.parse(text);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const listingId = String(body.listing_id || '');
    if (!UUID.test(listingId)) return res.status(400).json({ error: 'Vastu checks work on Ontario listings stored on this site.' });

    const supabase = db();
    const cached = await supabase.from('listing_vastu_ai').select('*').eq('listing_id', listingId).maybeSingle();
    if (cached.data) return res.status(200).json({ estimate: cached.data });

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) return res.status(429).json({ error: 'You have run several Vastu checks; please try again in an hour.' });

    const since = new Date(Date.now() - 24 * 3600_000).toISOString();
    const today = await supabase.from('listing_vastu_ai').select('listing_id', { count: 'exact', head: true }).gte('created_at', since);
    // Fail closed: if today's count can't be read, don't risk running up the Claude bill
    if (today.error || today.count === null || today.count >= (Number(process.env.VASTU_DAILY_LIMIT) || 150)) {
      return res.status(429).json({ error: 'The daily limit for AI Vastu checks is reached. Request a Vastu report from Jigar instead.' });
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .select('id,title,address,city,description,images,cover_image,status')
      .eq('id', listingId)
      .maybeSingle();
    if (error || !listing || listing.status === 'draft') return res.status(404).json({ error: 'Listing not found.' });

    const urls = [...new Set([listing.cover_image, ...(listing.images || [])].filter(Boolean))];
    const photos = await loadPhotos(urls);
    if (!photos.length) return res.status(422).json({ error: 'This listing has no photos the AI can read.' });

    const result = await analyse(listing, photos);
    const zones = Object.fromEntries(Object.entries(result.zones || {}).filter(([, room]) => room && room !== 'none'));
    const row = {
      listing_id: listingId,
      floor_plan_found: !!result.floor_plan_found && Object.keys(zones).length > 0,
      facing: DIRECTIONS.includes(result.facing) ? result.facing : null,
      zones,
      confidence: result.confidence,
      notes: result.notes,
      model: MODEL,
    };
    const saved = await supabase.from('listing_vastu_ai').upsert(row).select().single();
    if (saved.error) console.error('Saving Vastu estimate failed:', saved.error.message);
    return res.status(200).json({ estimate: saved.data || row });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'The AI is busy; please try again shortly.' });
    if (err instanceof Anthropic.APIError) {
      console.error('Claude API error:', err.status, err.message);
      return res.status(502).json({ error: 'The AI Vastu check is unavailable right now.' });
    }
    console.error('Vastu check error:', err);
    return res.status(err.status || 500).json({ error: err.message || 'Vastu check failed' });
  }
}
