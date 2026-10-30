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
