# Lumen — Agency Studio & E-commerce

A sophisticated full-stack **design agency portfolio + e-commerce storefront** built with
**Next.js 14 (App Router)**, **Supabase**, **Stripe**, and **Tailwind CSS**. It ships with a
polished dark/light brand UI and **runs out of the box with zero configuration** — Supabase and
Stripe are optional and the app falls back to rich seed data and a simulated checkout.

## Features

**Agency**
- Landing page with hero, client marquee, stats, testimonials
- Portfolio with project galleries & case-study detail pages
- Team profiles & studio story
- Service packages with pricing & process
- Journal / blog with case studies
- Client inquiry & proposal request form

**E-commerce**
- Product catalog with categories, filters & sorting
- Product detail with image gallery & stock awareness
- Product reviews (read + write)
- Persistent shopping cart (slide-out drawer, localStorage)
- Checkout with **Stripe Checkout (test mode)** + simulated demo checkout
- Order confirmation & customer order history
- **Admin dashboard**: revenue/stock overview, product inventory CRUD, order management

**Platform**
- Dark / light / system theme
- Supabase Auth (email/password) with role-based admin
- Postgres schema with Row-Level Security
- Responsive, accessible, animated UI

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — app runs without it
npm run dev                  # http://localhost:3000
```

Without env vars the app uses in-memory seed data and a simulated checkout, so every page,
the cart, reviews, and the admin dashboard are fully explorable.

## Connecting Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` then `supabase/seed.sql` in the SQL editor.
3. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
4. Make yourself admin: `update profiles set role = 'admin' where email = 'you@email.com';`

## Connecting Stripe (optional, test mode)

1. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test keys).
2. For order persistence, run the webhook locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   and set `STRIPE_WEBHOOK_SECRET`.
3. Test card: `4242 4242 4242 4242`, any future expiry/CVC.

## Architecture

See [`CLAUDE.md`](./CLAUDE.md). In short: a single data-access layer (`src/lib/data.ts`)
reads from Supabase when configured and from `src/lib/seed.ts` otherwise; money is stored in
integer cents; cart state is client-side Zustand.

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars from `.env.example` (optional — deploys fine without them).
3. Set the Stripe webhook endpoint to `https://your-domain/api/webhooks/stripe`.

## Keeping Supabase awake (free tier)

Supabase pauses free-tier projects after 7 days of inactivity. A **Vercel Cron**
(`vercel.json`) pings `/api/keep-alive` daily at 06:00 UTC, running a lightweight read so the
project never crosses that threshold — no Pro upgrade needed. Notes:

- Cron only fires on the **production** deployment (Hobby allows one run/day, which is plenty).
- Optional: set a `CRON_SECRET` env var in Vercel to lock the endpoint to Vercel's own cron
  caller — the route requires `Authorization: Bearer <CRON_SECRET>` when it's set, and stays
  open when it isn't.
- If Supabase isn't configured, the endpoint no-ops and returns OK.

## Nexus Market (`/market`)

A second, fully-designed **two-sided marketplace** experience lives under `/market`, layered
additively on top of Lumen without touching any existing route. It has its own navy/coral brand,
Plus Jakarta Sans typography, and Framer Motion throughout:

- Homepage with a unified services+products search, trending categories, featured sellers/products, and animated stat counters
- **Services marketplace** — filterable grid, service detail with Basic/Standard/Premium tiers, seller profiles, reviews
- **Products marketplace** — grid + detail with gallery, seller attribution, related items
- Unified **search results** across services and products
- **Seller dashboard** (Recharts earnings/traffic, active orders, listings manager, payouts, profile editor)
- **Buyer dashboard** (order tracking, purchase history, saved items, messages)
- **Multi-step checkout** (cart → address → payment → confirmation) with a progress bar
- **Admin panel** (revenue analytics, user management, listing moderation) and a Become-a-Seller flow

Marketplace content is mock data in `src/lib/nexus/` (graceful-degradation friendly); product data
is shared with Lumen via `src/lib/data.ts`. Recharts powers the dashboards.

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · Supabase · Stripe · Zustand · Framer Motion · Recharts · Lucide · Zod
