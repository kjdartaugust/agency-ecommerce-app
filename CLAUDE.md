# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # production build (run before deploy to catch type errors)
npm run start      # serve the production build
npm run lint       # next/eslint
npm run test       # vitest, single run
npm run test:watch # vitest, watch mode
```

Vitest covers pure domain logic only (`src/lib/*.test.ts`) — no component or
DOM testing is set up. Env vars are documented in `.env.example`; copy to
`.env.local`.

## Architecture

Next.js 14 **App Router** + TypeScript, Tailwind (CSS-variable theming, class-based dark mode), Supabase (Postgres + Auth), and Stripe (test mode) for checkout. Path alias `@/*` → `src/*`.

**Graceful-degradation data layer is the central design choice.** Supabase and Stripe are optional at runtime:
- `src/lib/env.ts` exposes `isSupabaseConfigured` / `isStripeConfigured`.
- All Supabase client factories (`src/lib/supabase/{client,server,admin}.ts`) return `null` when env vars are absent.
- `src/lib/data.ts` is the single data-access layer: it queries Supabase when configured, otherwise falls back to in-memory seed data in `src/lib/seed.ts`. **UI components must read through `data.ts`, never call Supabase directly**, so the app builds, renders, and demos with zero external services.

**Supabase clients** follow the `@supabase/ssr` split: `client.ts` (browser components), `server.ts` (server components/route handlers, cookie-based), `admin.ts` (service-role, server-only — webhooks/admin mutations).

**E-commerce flow:** cart state is client-side (`zustand`, persisted to localStorage) in `src/lib/store.ts`. Checkout is **order-first and provider-agnostic**: `POST /api/checkout` creates a `pending` order, then `src/lib/payments` resolves a provider and opens its hosted checkout; the provider's webhook flips the order to `paid` and routes it for fulfilment. Providers (`stripe`, `paystack`, `flutterwave`) live in `src/lib/payments/providers/` behind one `PaymentProvider` interface — each is enabled purely by presence of its env key, and with none set checkout falls back to a simulated demo order. Webhook signature verification lives in each provider; `src/lib/payments/webhook.ts` owns the idempotent paid-transition shared by every provider route. The charged total (incl. shipping) is computed authoritatively server-side, never trusted from the client. Orders/reviews/inquiries live in Supabase with RLS.

**Order routing:** after an order is paid it is split into one *fulfilment* per supplier. A `match` binds a product to a supplier at an agreed unit cost; routing picks the lowest `priority` among active suppliers, so a supplier can be re-pointed or paused without touching the catalogue. `src/lib/fulfillment.ts` is pure (decides the routing, persists nothing) and `fulfillment-store.ts` is the only writer — both the simulated and Stripe checkout paths call it so demo and real orders land identically. Margin is always *derived* from routing, never stored on the order. Items with no active supplier are surfaced as `unrouted` rather than dropped. Supplier costs are admin-only in RLS with no public read policy, since costs are the margin.

**Database:** schema, RLS policies, and seed SQL live in `supabase/` and mirror the types in `src/lib/types.ts`. Keep types, `seed.ts`, and the SQL in sync when changing the data model.

## Conventions

- Server Components by default; add `"use client"` only for interactivity (cart, theme toggle, forms).
- Money is stored and passed as integer **cents**; format only at render via `formatPrice` in `src/lib/utils.ts`.
- Use the `cn()` helper for conditional classes.
