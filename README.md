# Mensah Atelier — CODED AI Hackathon Submission

**Track:** Mensah | **Team slug:** mensah

Live: https://coded-hackathon-mensah-9bre.vercel.app  
Repo: https://github.com/jnopareboateng/coded-hackathon-mensah

---

## Overview

Mensah Atelier is a luxury tailored menswear storefront built on the CODED hackathon API. Customers browse the collection, add items to cart, provide their details, and complete orders via a pre-filled WhatsApp message — no payment gateway friction, just instant conversion.

---

## Features

| Feature | Notes |
|---|---|
| Product catalogue | Live from API, image proxy via `next/image` |
| Magazine-layout homepage | Hero + 3-up editorial grid |
| Cart with qty controls | Zustand + `sessionStorage` persist |
| WhatsApp checkout | POST /baskets → GET /baskets/{id} → `wa.me` link |
| Campaign pages | List, detail, and create your own |
| Team auto-registration | `registerTeam()` on first page load (409-safe) |
| Skeleton loading states | All data-fetch routes |
| Toast feedback | Sonner — success/error on all mutations |

---

## Architecture

```
app/
  page.tsx               → Homepage (hero + magazine grid)
  shop/page.tsx          → Full catalogue grid
  products/[id]/page.tsx → Product detail + add-to-cart
  campaigns/page.tsx     → Campaign list + create form
  campaigns/[id]/page.tsx→ Campaign detail with featured items

lib/
  api.ts       → Fetch wrappers for all 6 API endpoints
  queries.ts   → TanStack Query hooks (useItems, useCampaigns, …)
  store.ts     → Zustand cart (sessionStorage persist)
  format.ts    → formatPrice (GH₵), buildWhatsAppLink, buildOrderMessage

__tests__/lib/ → 20 unit tests (format, api, store)
```

**Stack:** Next.js 16 · React 19 · Tailwind v4 · TanStack Query v5 · Zustand v5 · Sonner · Radix UI

---

## Running locally

```bash
npm install
npm run dev
```

Required env vars (create `.env.local`):
```
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=mensah
NEXT_PUBLIC_TEAM_SLUG=mensah
NEXT_PUBLIC_WHATSAPP_NUMBER=+233551856093
```

## Tests

```bash
npm test
```

20 tests across format utilities, API helpers, and cart store.

---

## Checkout flow

1. User adds items → cart drawer opens
2. User fills name / phone / note (all optional)
3. POST `/baskets` with items + customer info → returns `{id}`
4. GET `/baskets/{id}` → full basket detail
5. `<a target="_blank">` opens WhatsApp with pre-filled order summary
6. Cart cleared, drawer closes

---

## Commercial viability

- Zero friction: WhatsApp is ubiquitous in Ghana — no card required
- Campaign system lets the merchant create promotional pushes with curated item selections
- Session-persisted cart survives page navigation without a backend session
- `registerTeam()` is idempotent (ignores 409) so multi-tab loads are safe
