# Setup: database, admin access, AI and deploy

The site has two apps that share one Supabase database:

| App | Folder | What it is |
|---|---|---|
| Client site | `client-site/` | Public website: listings, search, property pages, chat |
| Admin panel | `admin-panel/` | Jigar's back office: listings, Vastu, inquiries, images, analytics |

## 1. Database (Supabase)

1. Create a Supabase project (region `ca-central-1` keeps Canadian client data in Canada).
2. SQL Editor → run `supabase/migrations/20261030000000_master_schema.sql`.
   It creates every table, the role functions, row-level security and the `realtorjigar-images` storage bucket.
3. Optional, for testing: run `supabase/seed-demo.sql` (three `[DEMO]` listings, delete before launch).

## 2. First admin account

1. Open the admin panel's `/auth` page and sign up with Jigar's email (confirm the email).
2. SQL Editor:

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'superadmin' from auth.users where email = 'jigar@jigarpatelrealestate.com';
```

Roles: `superadmin` (everything, including Users), `admin` (everything except Users), `editor` (listings, images, inquiries).
A superadmin can add more staff by inserting rows the same way.

## 3. Environment variables

Set these for both apps, locally in `.env` (see `.env.example`) and in each Vercel project:

| Variable | Used by |
|---|---|
| `VITE_SUPABASE_URL` | browser + server functions |
| `VITE_SUPABASE_ANON_KEY` | browser + server functions |
| `ANTHROPIC_API_KEY` | server functions only (`client-site/api/chat.js`, `admin-panel/api/ai.js`) |

The Anthropic key is never sent to the browser. The old `VITE_OPENAI_API_KEY` is no longer used and should be removed from Vercel.

## 4. Deploy

Each app is its own Vercel project (root directory `client-site` or `admin-panel`). `vercel.json` sends every path
except `/api/*` to the React app, so the AI functions keep working.

Local development: `npm install && npm run dev` in each folder. The `/api` functions need `vercel dev` to run locally.

## MLS® listings (CREA DDF®)

`admin-panel/api/ddf-sync.js` copies MLS® listings into `listings` (`source = 'ddf'`) every night at 09:00 UTC
(Vercel cron in `admin-panel/vercel.json`), and on demand from **Admin → Properties → MLS® Feed → Sync now**.

1. Run `supabase/migrations/20261111000000_ddf_listings.sql` (adds the feed columns and the sync functions).
2. In the **admin** Vercel project set: `DDF_CLIENT_ID`, `DDF_CLIENT_SECRET` (from CREA's DDF® portal),
   `SUPABASE_SERVICE_ROLE_KEY` (Supabase → API settings, keep secret), `CRON_SECRET` (any long random string),
   and optionally `DDF_CITIES` and `DDF_MAX_LISTINGS`.
3. Deploy, then Admin → Properties → MLS® Feed → "Find Jigar's agent key". Put the key in `DDF_AGENT_KEYS`,
   redeploy, and press **Sync now**.

What gets synced: all of Jigar's own listings, plus the newest `DDF_MAX_LISTINGS` listings in `DDF_CITIES`.
Listings that leave the feed are deleted on the next sync (CREA requirement). A failed fetch never deletes anything.

- Jigar's own listings: shown first with a "Jigar's Listing" badge, featured by default, and editable in the admin
  panel for Vastu, featured and SEO only. The sync never overwrites those edits.
- Other brokerages' listings: website only, with the listing brokerage, MLS® number, a "View on REALTOR.ca" link and
  CREA's trademark notice (`client-site/src/components/DdfAttribution.tsx`).

## How Vastu works

- In the admin panel, open a property → **Vastu** tab. Turn on "Show Vastu details", set the facing and the room in each
  of the 9 zones (or upload a floor plan and let AI fill it in), then save.
- The score (0–10) is calculated by `src/lib/vastu.ts` (identical copy in each app) and stored in `listings.vastu_score`.
  It needs at least 3 filled-in items.
- On the website, the listing gets a Vastu badge, a Vastu section on its page, and appears in the
  "Facing" and "Vastu-friendly homes only (score 7+)" search filters.

## AI features (Claude)

| Where | Feature |
|---|---|
| Admin → Property → Basic | "Write with AI" listing description |
| Admin → Property → SEO | "Generate SEO" title, description, keywords (adds Vastu keywords) |
| Admin → Property → Vastu | "Upload floor plan" fills facing and room zones |
| Admin → Inquiries → View | "Draft reply with AI", then open in email or copy |
| Admin, every page | Chat assistant |
| Website, every page | Chat assistant that knows the current listings |

Admin AI calls are only answered for signed-in staff accounts.
