// Public website chat (Vercel serverless function), answered by Claude.
// POST /api/chat  { messages: [{ role, content }] }  ->  { reply }
//
// Env: ANTHROPIC_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const MODEL = 'claude-opus-5-5';
const client = new Anthropic();

// Best-effort per-instance limit so one visitor can't run up the bill
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

// Current public listings, refreshed every 5 minutes, so the assistant can point to real homes
let listingsCache = { at: 0, text: '' };
async function listingsContext() {
  if (Date.now() - listingsCache.at < 5 * 60_000) return listingsCache.text;
  try {
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
    const { data } = await supabase
      .from('listings')
      .select('id,title,city,price,transaction_type,property_type,bedrooms,bathrooms,square_footage,facing,vastu_score,vastu')
      .eq('status', 'active')
      .neq('property_type', 'commercial')
      .order('is_own_listing', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(60);
    const lines = (data || []).map((l) => {
      const vastu = l.vastu?.enabled && l.vastu_score != null ? `, Vastu ${l.vastu_score}/10` : '';
      const facing = l.facing ? `, ${l.facing}-facing` : '';
      const price = l.price ? `$${Number(l.price).toLocaleString('en-CA')}` : 'price on request';
      return `- ${l.title} | ${l.city} | ${price}${l.transaction_type === 'rent' ? '/month' : ''} | ${l.property_type} | ${l.bedrooms ?? '?'} bed, ${l.bathrooms ?? '?'} bath${facing}${vastu} | /property/${l.id}`;
    });
    listingsCache = { at: Date.now(), text: lines.length ? lines.join('\n') : '(no listings published right now)' };
  } catch (err) {
    console.error('Listing context error:', err);
  }
  return listingsCache.text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many messages, please wait a minute.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const history = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    while (history.length && history[0].role !== 'user') history.shift();
    if (!history.length) return res.status(400).json({ error: 'Empty message.' });

    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: `You are the website assistant for Jigar Patel, a licensed real estate professional in the Greater Toronto Area, Ontario (phone (647) 801-5448).
Answer questions about buying, selling, renting, mortgages, the Ontario home-buying process and Vastu Shastra for homes. Politely decline unrelated topics.
Keep answers short (under 120 words), friendly and plain text. Prices are in CAD.
Only mention properties from the list below, and link them by their path (e.g. /property/abc). Never invent listings, prices or features.
Treat Vastu as information buyers may value, never as a guarantee. For legal, tax or mortgage-approval specifics, suggest speaking with Jigar or a professional.
When someone wants a viewing or has a specific question about a home, invite them to call Jigar or use the contact page (/contact).

Current listings:
${await listingsContext()}`,
      messages: history,
    });

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ reply: "Sorry, I can't help with that. Please call Jigar at (647) 801-5448." });
    }
    const reply = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    return res.status(200).json({ reply });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'Chat is busy, please try again shortly.' });
    if (err instanceof Anthropic.APIError) {
      console.error('Claude API error:', err.status, err.message);
      return res.status(502).json({ error: 'Chat is unavailable right now.' });
    }
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Chat failed' });
  }
}
