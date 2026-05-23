# Mensah — AI Fashion Hackathon Design Spec

**Date:** 2026-05-23  
**Track:** Mensah (Solo — Luxury/Tailored Menswear)  
**Merchant slug:** `mensah`  
**API base:** `https://api-hackathon.codedematrixtech.com`  
**Deploy target:** Vercel  

---

## Visual Identity

**Direction:** Clean Minimal  
- Background: `#fafaf8` (off-white)  
- Foreground: `#1a1a1a` (near-black)  
- Accent: `#1a1a1a` (buttons), `#888` (secondary text)  
- Serif headlines: `DM Serif Display`  
- Body / UI: `Inter`  
- Generous whitespace, thin borders, no drop shadows  

**Brand tone:** Editorial. "MENSAH" always uppercase, letter-spaced. No exclamation marks.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14+ App Router | SSR + RSC for API data, Vercel deploy |
| Styling | Tailwind CSS | Full layout control for magazine grid |
| UI components | ShadCN UI | Sheet (cart), Dialog (quickview), Skeleton, Badge |
| Server state | TanStack Query | Caching, background refetch, loading/error states |
| Client state | Zustand | Cart — persisted to sessionStorage |
| Language | TypeScript | Type safety on API responses |

---

## Pages & Routes

| Route | Component | Data |
|---|---|---|
| `/` | `HomePage` | Featured items (first 5), active campaigns |
| `/shop` | `ShopPage` | All 10 Mensah items |
| `/products/[id]` | `ProductPage` | Single item detail |
| `/campaigns` | `CampaignsPage` | All campaigns for mensah |
| Cart | ShadCN `Sheet` (drawer) | Zustand store |

No separate checkout page. Checkout is the WhatsApp deep-link flow triggered from the cart drawer.

---

## Homepage Layout (Magazine Grid)

```
┌─────────────────────────────────────────┐
│  MENSAH          Shop · Campaigns · 🛍  │  ← sticky nav
├─────────────────────────────────────────┤
│                                         │
│   THE MENSAH EDIT          [outfit img] │  ← split hero: text left, image right
│   Tailored for the Occasion             │
│   [SHOP THE COLLECTION]                 │
│                                         │
├─────────────────────────────────────────┤
│  ▌ ACTIVE CAMPAIGN — Spring 2025 ▌     │  ← dark campaign strip (scrolls)
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────┐  ┌──────┐           │
│  │               │  │      │           │  ← magazine asymmetric grid
│  │  [large img]  │  │      │           │    col-span-2 left, stacked right
│  │               │  ├──────┤           │
│  │  Outfit Name  │  │      │           │
│  │  GH₵ X,XXX   │  │      │           │
│  └───────────────┘  └──────┘           │
│                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐         │  ← 3-col product grid below
│  │      │  │      │  │      │         │
│  └──────┘  └──────┘  └──────┘         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Data Layer

### API client (`lib/api.ts`)
Typed wrappers for each endpoint. Prepend base URL to all image paths.

```ts
const BASE = 'https://api-hackathon.codedematrixtech.com'
const MERCHANT = 'mensah'
```

Key functions:
- `getItems()` → `GET /merchants/mensah/items`
- `getItem(id)` → `GET /items/{id}`
- `getCampaigns()` → `GET /merchants/mensah/campaigns`
- `createBasket(payload)` → `POST /baskets`
- `getBasket(id)` → `GET /baskets/{id}`

### TanStack Query hooks (`lib/queries.ts`)
- `useItems()` — staleTime 5 min
- `useItem(id)`
- `useCampaigns()` — staleTime 2 min

### Zustand cart store (`lib/store.ts`)
```ts
interface CartItem { item_id: string; qty: number; item_note?: string }
interface CartStore {
  items: CartItem[]
  add(item: CartItem): void
  remove(item_id: string): void
  updateQty(item_id: string, qty: number): void
  clear(): void
}
```
Persisted to `sessionStorage` via `zustand/middleware/persist`.

---

## WhatsApp Checkout Flow

`POST /baskets` returns only `{ id }` — a second call is required for the full basket.

1. User opens cart drawer → fills optional customer name, phone, order note
2. Clicks "Order via WhatsApp" → button disables, shows spinner
3. App calls `POST /baskets` with `{ merchant_id: 'mensah', items: [...], customer_name, customer_phone, customer_note, team_slug: 'mensah' }`
4. On `201`: receives `{ id }` → calls `GET /baskets/{id}` → gets full basket (items, total_minor, currency)
5. Builds order summary string + deep-link: `https://wa.me/233551856093?text={encoded summary}`
6. Renders a `<a href={link} target="_blank">` button — **never `window.open`** (popup-blocked after await)
7. User clicks the rendered link → WhatsApp opens pre-filled
8. Cart clears on link click (not on basket creation, so user can retry if WhatsApp fails)

**WhatsApp number:** `+233551856093` → strip to `233551856093` for the `wa.me` URL. Stored as `NEXT_PUBLIC_WHATSAPP_NUMBER=+233551856093`; strip non-digits in `buildWhatsAppLink()`.

**team_slug is always `"mensah"`** — never optional in the basket payload.

---

## Campaigns Strategy

Live `GET /merchants/mensah/campaigns` returns `[]`. To score on Functionality + Data Integrity:

- The `/campaigns` page shows **real API campaigns** plus a visible **"Create Campaign"** form
- On submit: `POST /campaigns { merchant_id: 'mensah', title, copy_text, featured_item_ids, team_slug: 'mensah' }`
- After creation: re-fetches campaigns (TanStack Query invalidation) → newly created campaign appears
- Campaign detail: `/campaigns/[id]` → `GET /campaigns/{id}` → shows title, copy, featured items with prices
- Homepage campaign strip: shows only if `campaigns.length > 0`; collapses to a subtle editorial tagline if empty

This makes Campaigns a full CRUD-visible feature, not a blank page.

---

## Team Registration

The `mensah` team slug exists but is **unregistered** (`registered: false`). App should call `POST /teams` on first load:
```ts
{ slug: 'mensah', name: 'Mensah Atelier', merchant_id: 'mensah' }
```
Wrapped in try/catch — a `409` (already registered) is silently ignored.

---

## Component Tree

```
app/
  layout.tsx              ← server component: fonts, metadata
  providers.tsx           ← "use client": QueryClientProvider
  page.tsx                ← HomePage
  shop/page.tsx           ← ShopPage
  products/[id]/page.tsx  ← ProductPage
  campaigns/
    page.tsx              ← CampaignsPage (list + create form)
    [id]/page.tsx         ← CampaignDetailPage

components/
  layout/
    Navbar.tsx            ← sticky, logo from API, cart badge
    Footer.tsx
    CartDrawer.tsx        ← ShadCN Sheet, checkout trigger
  product/
    ProductCard.tsx       ← image, name, price, "Add to Cart"
    MagazineGrid.tsx      ← asymmetric CSS grid layout
    ProductGrid.tsx       ← uniform 3-col grid (shop page)
  campaign/
    CampaignStrip.tsx     ← dark strip, hidden when campaigns empty
    CampaignCard.tsx
    CreateCampaignForm.tsx ← POST /campaigns form
  ui/                     ← ShadCN generated components
  checkout/
    CheckoutForm.tsx      ← customer name/phone/note inputs
    WhatsAppLink.tsx      ← renders <a> after basket created

lib/
  api.ts        ← typed fetch wrappers
  queries.ts    ← TanStack Query hooks
  store.ts      ← Zustand cart store
  format.ts     ← formatPrice, buildWhatsAppLink, buildOrderMessage

types/
  api.ts        ← Item, Basket, Campaign, Merchant, BasketItem interfaces

next.config.ts  ← images.remotePatterns for api-hackathon.codedematrixtech.com
```

---

## Pricing Display

All prices from API are in pesewas. Display as:
```ts
const formatPrice = (minor: number) =>
  `GH₵ ${(minor / 100).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
```

---

## Key Constraints & Edge Cases

| Constraint | Handling |
|---|---|
| Mensah has no WhatsApp number in API | Hardcoded `+233551856093` via env var; strip non-digits for wa.me URL |
| `POST /baskets` returns only `{id}` | Always call `GET /baskets/{id}` after creation |
| team_slug required for scoring | Always send `team_slug: 'mensah'` in baskets and campaigns |
| window.open popup blocked after await | Render `<a target="_blank">` after basket created; never call window.open |
| Cart clear timing | Clear cart on WhatsApp link click, not on basket creation |
| Out-of-stock items | `in_stock: false` → disabled "Add to Cart", "Sold Out" badge |
| Image paths are relative | Prepend `BASE` in api.ts; add `images.remotePatterns` to next.config.ts |
| Cart duplicate items | `add()` merges qty if item_id already in cart |
| Cart qty = 0 | `updateQty(id, 0)` removes item |
| Campaigns array empty | Show create form; strip hidden when empty on homepage |
| item descriptions are empty | Use editorial UI copy; API name/price remain canonical |
| Team unregistered | Auto-register on app boot; ignore 409 |
| Basket is immutable after creation | No editing; user must start fresh order |
| All items must be same merchant | Enforced by design (single-merchant store) |
| Prices in pesewas | Always divide by 100 before display |
| `image_urls` nullable on items | Guard with `item.image_urls?.[0] ?? '/placeholder.jpg'` |
| API errors | Show toast/inline error for 404, 422, network failures; never crash |

---

## Judging Alignment

| Criterion | How we score |
|---|---|
| UI & Design | Magazine grid + Clean Minimal = premium fashion aesthetic |
| Functionality | All 3 required integrations (inventory, WhatsApp, campaigns) wired |
| Testing | Loading skeletons, error boundaries, edge case fallbacks visible |
| Data Integrity | TanStack Query ensures fresh data; basket confirms via `GET /baskets/{id}` |
| Commercial Viability | Real checkout flow (WhatsApp is a primary commerce channel in Ghana) |
