// Claude-powered helpers for the admin panel (Vercel serverless function).
// POST /api/ai  { action, ...payload }  with the staff user's Supabase access token
// in the Authorization header. Only active superadmin/admin/editor accounts are served.
//
// Env: ANTHROPIC_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const MODEL = 'claude-opus-5-5';
const STAFF_ROLES = ['superadmin', 'admin', 'editor'];
const ZONES = ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'];
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const ROOMS = [
  'living', 'kitchen', 'master_bedroom', 'bedroom', 'pooja', 'dining',
  'bathroom', 'staircase', 'study', 'garage', 'open', 'other', 'none',
];

const client = new Anthropic();

const BRAND = `You work for Jigar Patel, a licensed real estate professional in the Greater Toronto Area, Ontario, Canada.
Many of his clients are South Asian families, so Vastu Shastra details matter to them.
Never invent facts about a property: use only the details you are given. Prices are in CAD.
Follow Ontario (TRESA/RECO) advertising rules: no misleading claims, no guarantees about value or Vastu outcomes.`;

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const raw = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
  return JSON.parse(raw || '{}');
}

async function isStaff(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.rpc('get_current_user_role');
  return !error && STAFF_ROLES.includes(data);
}

async function ask({ system, content, effort = 'medium', schema }) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system,
    messages: Array.isArray(content) && content[0]?.role ? content : [{ role: 'user', content }],
    output_config: schema ? { effort, format: { type: 'json_schema', schema } } : { effort },
  });

  if (response.stop_reason === 'refusal') {
    throw Object.assign(new Error('Claude declined this request.'), { status: 422 });
  }
  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
  return schema ? JSON.parse(text) : text;
}

function listingSummary(listing = {}) {
  const fields = {
    title: listing.title,
    address: [listing.address, listing.city, listing.province].filter(Boolean).join(', '),
    price: listing.price,
    for: listing.transaction_type === 'rent' ? 'rent' : 'sale',
    type: listing.property_type,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    square_feet: listing.square_feet,
    lot_size: listing.lot_size,
    year_built: listing.year_built,
    facing: listing.facing,
    vastu_score: listing.vastu_score,
    vastu_checks: listing.vastu_checks,
    agent_notes: listing.description,
  };
  return JSON.stringify(Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== '')), null, 2);
}

const actions = {
  // Listing description from the form fields (and Vastu checks when present)
  async describe({ listing }) {
    const description = await ask({
      system: `${BRAND}\nYou write property listing descriptions for his website.`,
      content: `Write a listing description for this property, 120-180 words, in 2-3 short paragraphs of plain text (no headings, no markdown, no emoji).
Lead with what makes it attractive to a family. If Vastu details are present, add one natural sentence about them (for example "East-facing with the kitchen in the south-east"), framed as information, not a promise.
If agent_notes are given, keep every fact from them.

Property:
${listingSummary(listing)}`,
    });
    return { description };
  },

  // Search-engine fields, blending in Vastu keywords when the listing has them
  async seo({ listing }) {
    return ask({
      system: `${BRAND}\nYou write SEO metadata for his listing pages.`,
      content: `Write SEO metadata for this listing page.
- seo_title: at most 60 characters, includes the property type and city.
- seo_description: at most 155 characters, one sentence, includes the city and a reason to click.
- meta_keywords: 6-10 comma-separated phrases people in the GTA actually search, e.g. "3 bedroom house for sale Brampton". If facing or Vastu details are present, include one or two such phrases (e.g. "vastu compliant home Brampton", "east facing house Mississauga").

Property:
${listingSummary(listing)}`,
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['seo_title', 'seo_description', 'meta_keywords'],
        properties: {
          seo_title: { type: 'string' },
          seo_description: { type: 'string' },
          meta_keywords: { type: 'string' },
        },
      },
    });
  },

  // Read a floor plan image and suggest the facing + which room sits in each zone
  async floorplan({ image, media_type, north_hint }) {
    if (!image || !/^image\/(png|jpeg|webp|gif)$/.test(media_type || '')) {
      throw Object.assign(new Error('Upload a PNG, JPG or WebP floor plan.'), { status: 400 });
    }
    const zoneProps = Object.fromEntries(ZONES.map((z) => [z, { type: 'string', enum: ROOMS }]));
    return ask({
      effort: 'high',
      system: `${BRAND}\nYou read architectural floor plans for Vastu Shastra analysis.`,
      content: [
        { type: 'image', source: { type: 'base64', media_type, data: image } },
        {
          type: 'text',
          text: `Analyse this floor plan for Vastu.
1. Find north: use a north arrow or compass on the plan if there is one${north_hint ? `; the agent says: "${north_hint}"` : '; if there is none, assume the top of the image is north and say so in notes'}.
2. Split the house footprint into a 3x3 grid of zones (NW, N, NE / W, C, E / SW, S, SE) relative to true north.
3. For each zone give the main room that occupies it: ${ROOMS.join(', ')}. "bathroom" covers any washroom or powder room, "open" an open area or courtyard, "none" if the zone is outside the house or you cannot tell. When a zone has several rooms, pick the one most significant for Vastu (kitchen, pooja, master bedroom, washroom or staircase over hallways).
4. facing is the direction the main entrance door faces, or "unknown".
5. notes: one or two sentences on how sure you are and anything the agent should double-check. Plain text.`,
        },
      ],
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['facing', 'zones', 'notes'],
        properties: {
          facing: { type: 'string', enum: [...DIRECTIONS, 'unknown'] },
          zones: { type: 'object', additionalProperties: false, required: ZONES, properties: zoneProps },
          notes: { type: 'string' },
        },
      },
    });
  },

  // First reply to a website lead
  async inquiry_reply({ inquiry, listing_title }) {
    const reply = await ask({
      effort: 'low',
      system: `${BRAND}\nYou draft email replies to website inquiries, signed "Jigar Patel". Warm, brief, professional.`,
      content: `Draft a reply (under 140 words, plain text, no subject line) to this inquiry. Answer what you can from the details given, never invent property facts, and end by proposing a call or a viewing.
${listing_title ? `Property they asked about: ${listing_title}\n` : ''}From: ${inquiry?.name}
Message: ${inquiry?.message}`,
    });
    return { reply };
  },

  // Admin chat bubble
  async chat({ messages }) {
    const history = (Array.isArray(messages) ? messages : [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    while (history.length && history[0].role !== 'user') history.shift();
    if (!history.length) throw Object.assign(new Error('Empty message.'), { status: 400 });
    const reply = await ask({
      effort: 'low',
      system: `${BRAND}\nYou are the assistant inside his admin panel. Help with listings, marketing copy, client follow-ups, Ontario real estate process and Vastu questions. Be concise; plain text.`,
      content: history,
    });
    return { reply };
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!(await isStaff(req))) return res.status(401).json({ error: 'Sign in with a staff account to use AI tools.' });
    const body = await readBody(req);
    const action = actions[body.action];
    if (!action) return res.status(400).json({ error: `Unknown action "${body.action}"` });
    return res.status(200).json(await action(body));
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'AI is busy, try again in a minute.' });
    if (err instanceof Anthropic.AuthenticationError) return res.status(500).json({ error: 'AI is not configured (ANTHROPIC_API_KEY).' });
    if (err instanceof Anthropic.APIError) return res.status(502).json({ error: `AI error: ${err.message}` });
    console.error('AI handler error:', err);
    return res.status(err.status || 500).json({ error: err.message || 'AI request failed' });
  }
}
