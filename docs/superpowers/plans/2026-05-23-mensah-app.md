# Mensah E-Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Clean Minimal fashion e-commerce storefront for the Mensah brand — magazine layout, TanStack Query for API data, Zustand for cart, WhatsApp deep-link checkout, campaign creation UI.

**Architecture:** Next.js 14 App Router; `app/layout.tsx` is a server component; `app/providers.tsx` ("use client") wraps children with QueryClientProvider. TanStack Query for all API data. Zustand (sessionStorage persist) for cart. ShadCN Sheet for cart drawer. WhatsApp checkout: POST /baskets → GET /baskets/{id} → render `<a>` link (never window.open).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, ShadCN UI, TanStack Query v5, Zustand v4, Jest, React Testing Library

**Constants:**
- API base: `https://api-hackathon.codedematrixtech.com`
- Merchant slug: `mensah`
- Team slug: `mensah`
- WhatsApp: `+233551856093` → strip to `233551856093` for wa.me
- Logo: `{BASE}/images/mensah/logo.png`
- Items: outfit-1..outfit-10, all in stock, prices in pesewas

---

## File Map

| File | Responsibility |
|---|---|
| `types/api.ts` | Item, Campaign, CampaignDetail, Basket, BasketDetail, Merchant types |
| `lib/format.ts` | formatPrice, buildWhatsAppLink, buildOrderMessage |
| `lib/api.ts` | Typed fetch wrappers; resolveImageUrl; registerTeam |
| `lib/store.ts` | Zustand cart: add (merge), remove, updateQty, clear, openCart |
| `lib/queries.ts` | TanStack Query hooks: useItems, useItem, useCampaigns, useCampaign |
| `app/providers.tsx` | "use client" — QueryClientProvider |
| `app/layout.tsx` | Server component — fonts, metadata, providers, Navbar, CartDrawer |
| `app/page.tsx` | Homepage: hero, campaign strip, magazine grid |
| `app/shop/page.tsx` | Full catalog 3-col grid |
| `app/products/[id]/page.tsx` | Product detail + add to cart |
| `app/campaigns/page.tsx` | Campaign list + create form |
| `app/campaigns/[id]/page.tsx` | Campaign detail with featured items |
| `components/layout/Navbar.tsx` | Sticky nav, logo from API, cart badge |
| `components/layout/CartDrawer.tsx` | ShadCN Sheet, checkout form, WhatsApp link |
| `components/product/ProductCard.tsx` | Image, name, price, Add to Cart |
| `components/product/MagazineGrid.tsx` | Asymmetric CSS grid |
| `components/product/ProductGrid.tsx` | Uniform 3-col grid |
| `components/campaign/CampaignStrip.tsx` | Dark strip, hidden when empty |
| `components/campaign/CampaignCard.tsx` | Campaign list card |
| `components/campaign/CreateCampaignForm.tsx` | POST /campaigns form |
| `components/checkout/CheckoutForm.tsx` | Name/phone/note inputs |
| `components/checkout/WhatsAppLink.tsx` | Renders `<a>` after basket created |
| `__tests__/lib/format.test.ts` | formatPrice, buildWhatsAppLink, buildOrderMessage |
| `__tests__/lib/store.test.ts` | Cart add/merge, remove, updateQty, clear |
| `__tests__/lib/api.test.ts` | resolveImageUrl, API error handling |
| `next.config.ts` | images.remotePatterns for API host |
| `.env.local` | NEXT_PUBLIC_API_BASE, NEXT_PUBLIC_MERCHANT_SLUG, NEXT_PUBLIC_TEAM_SLUG, NEXT_PUBLIC_WHATSAPP_NUMBER |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local`, `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd /home/minojosh/projects/justjosh/coded
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

Expected: project files created, no prompts (--yes)

- [ ] **Step 2: Install dependencies**

```bash
yarn add @tanstack/react-query @tanstack/react-query-devtools zustand
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest ts-jest
```

- [ ] **Step 3: Initialize ShadCN**

```bash
npx shadcn@latest init --yes
npx shadcn@latest add sheet button badge skeleton dialog separator input label toast
```

When prompted for style: Default. For base color: Neutral. For CSS variables: Yes.

- [ ] **Step 4: Write `.env.local`**

```
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=mensah
NEXT_PUBLIC_TEAM_SLUG=mensah
NEXT_PUBLIC_WHATSAPP_NUMBER=+233551856093
```

- [ ] **Step 5: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-hackathon.codedematrixtech.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 6: Write `jest.config.ts`**

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 7: Write `jest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 app with Tailwind, ShadCN, TanStack Query, Zustand"
```

---

## Task 2: Types

**Files:**
- Create: `types/api.ts`

- [ ] **Step 1: Write `types/api.ts`**

```ts
export interface Item {
  id: string
  merchant_id: string
  name: string
  description: string | null
  price_minor: number
  currency: string
  image_urls: string[] | null
  in_stock: boolean
}

export interface Merchant {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  brand_colors: string[] | null
  whatsapp_number: string | null
}

export interface CampaignSummary {
  id: string
  title: string
  copy_text: string | null
  image_urls: string[] | null
  team_slug: string | null
  created_at: number
}

export interface CampaignFeaturedItem {
  id: string
  name: string
  price_minor: number
  currency: string
  image_url: string | null
  in_stock: boolean
}

export interface CampaignDetail {
  id: string
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  title: string
  copy_text: string | null
  image_urls: string[] | null
  featured_items: CampaignFeaturedItem[]
  team_slug: string | null
  created_at: number
}

export interface BasketItemInput {
  item_id: string
  qty: number
  item_note?: string | null
}

export interface CreateBasketPayload {
  merchant_id: string
  items: BasketItemInput[]
  customer_name?: string | null
  customer_phone?: string | null
  customer_note?: string | null
  team_slug: string
}

export interface BasketLineItem {
  item_id: string
  name: string
  price_minor: number
  currency: string
  image_url: string | null
  in_stock: boolean
  qty: number
  item_note: string | null
}

export interface BasketDetail {
  id: string
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  items: BasketLineItem[]
  total_minor: number
  currency: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_note: string | null
  team_slug: string | null
  created_at: number
}

export interface CreateCampaignPayload {
  merchant_id: string
  title: string
  copy_text?: string | null
  image_urls?: string[] | null
  featured_item_ids?: string[] | null
  team_slug: string
}
```

- [ ] **Step 2: Commit**

```bash
git add types/api.ts
git commit -m "feat: add API types"
```

---

## Task 3: Format Utilities (TDD)

**Files:**
- Create: `lib/format.ts`, `__tests__/lib/format.test.ts`

- [ ] **Step 1: Create test file**

```bash
mkdir -p __tests__/lib
```

```ts
// __tests__/lib/format.test.ts
import { formatPrice, buildWhatsAppLink, buildOrderMessage } from '@/lib/format'
import type { BasketDetail } from '@/types/api'

describe('formatPrice', () => {
  it('formats pesewas to GHS with 2 decimal places', () => {
    expect(formatPrice(85000)).toBe('GH₵ 850.00')
  })
  it('formats a low price', () => {
    expect(formatPrice(35000)).toBe('GH₵ 350.00')
  })
  it('formats zero', () => {
    expect(formatPrice(0)).toBe('GH₵ 0.00')
  })
})

describe('buildWhatsAppLink', () => {
  it('strips + and non-digits from phone', () => {
    const link = buildWhatsAppLink('+233551856093', 'Hello')
    expect(link).toContain('wa.me/233551856093')
  })
  it('encodes the message text', () => {
    const link = buildWhatsAppLink('+233551856093', 'Order: Outfit 1 x1')
    expect(link).toContain(encodeURIComponent('Order: Outfit 1 x1'))
  })
})

describe('buildOrderMessage', () => {
  const basket: BasketDetail = {
    id: 'abc123',
    merchant: { id: 'mensah', name: 'Mensah', whatsapp_number: null },
    items: [
      { item_id: 'outfit-1', name: 'Outfit 1', price_minor: 80000, currency: 'GHS', image_url: null, in_stock: true, qty: 2, item_note: null },
    ],
    total_minor: 160000,
    currency: 'GHS',
    customer_name: 'Kwame',
    customer_phone: null,
    customer_note: null,
    team_slug: 'mensah',
    created_at: 1706000000,
  }

  it('includes item name and qty', () => {
    const msg = buildOrderMessage(basket)
    expect(msg).toContain('Outfit 1 x2')
  })
  it('includes total', () => {
    const msg = buildOrderMessage(basket)
    expect(msg).toContain('GH₵ 1,600.00')
  })
  it('includes basket id', () => {
    const msg = buildOrderMessage(basket)
    expect(msg).toContain('abc123')
  })
  it('includes customer name when present', () => {
    const msg = buildOrderMessage(basket)
    expect(msg).toContain('Kwame')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
yarn jest __tests__/lib/format.test.ts
```

Expected: `Cannot find module '@/lib/format'`

- [ ] **Step 3: Write `lib/format.ts`**

```ts
import type { BasketDetail } from '@/types/api'

export function formatPrice(minor: number): string {
  return `GH₵ ${(minor / 100).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function buildWhatsAppLink(rawPhone: string, message: string): string {
  const digits = rawPhone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function buildOrderMessage(basket: BasketDetail): string {
  const lines = basket.items.map(
    (item) => `• ${item.name} x${item.qty} — ${formatPrice(item.price_minor * item.qty)}`
  )
  const parts = [`Hello! I'd like to place an order with Mensah:`]
  if (basket.customer_name) parts.push(`Name: ${basket.customer_name}`)
  parts.push('', ...lines, '', `Total: ${formatPrice(basket.total_minor)}`, `Ref: ${basket.id}`)
  return parts.join('\n')
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
yarn jest __tests__/lib/format.test.ts
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts __tests__/lib/format.test.ts
git commit -m "feat: add format utilities with tests"
```

---

## Task 4: API Client (TDD)

**Files:**
- Create: `lib/api.ts`, `__tests__/lib/api.test.ts`

- [ ] **Step 1: Write tests**

```ts
// __tests__/lib/api.test.ts
import { resolveImageUrl } from '@/lib/api'

describe('resolveImageUrl', () => {
  const BASE = 'https://api-hackathon.codedematrixtech.com'

  it('prepends base to relative paths', () => {
    expect(resolveImageUrl('/images/mensah/outfit1.jpeg')).toBe(
      `${BASE}/images/mensah/outfit1.jpeg`
    )
  })
  it('returns absolute URLs unchanged', () => {
    expect(resolveImageUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg')
  })
  it('returns empty string for empty input', () => {
    expect(resolveImageUrl('')).toBe('')
  })
  it('returns empty string for null input', () => {
    expect(resolveImageUrl(null)).toBe('')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
yarn jest __tests__/lib/api.test.ts
```

- [ ] **Step 3: Write `lib/api.ts`**

```ts
import type {
  Item, Merchant, CampaignSummary, CampaignDetail,
  CreateBasketPayload, BasketDetail, CreateCampaignPayload,
} from '@/types/api'

export const BASE = process.env.NEXT_PUBLIC_API_BASE!
export const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG!
export const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG!

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE}${path}`
}

function resolveItem(item: Item): Item {
  return {
    ...item,
    image_urls: item.image_urls?.map(resolveImageUrl) ?? null,
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `API error ${res.status}`)
  }
  return res.json()
}

export async function registerTeam(): Promise<void> {
  try {
    await apiFetch('/teams', {
      method: 'POST',
      body: JSON.stringify({ slug: TEAM_SLUG, name: 'Mensah Atelier', merchant_id: MERCHANT }),
    })
  } catch {
    // 409 = already registered; ignore all errors silently
  }
}

export async function getMerchant(): Promise<Merchant> {
  return apiFetch(`/merchants/${MERCHANT}`)
}

export async function getItems(): Promise<Item[]> {
  const items = await apiFetch<Item[]>(`/merchants/${MERCHANT}/items`)
  return items.map(resolveItem)
}

export async function getItem(id: string): Promise<Item> {
  const item = await apiFetch<Item>(`/items/${id}`)
  return resolveItem(item)
}

export async function getCampaigns(): Promise<CampaignSummary[]> {
  return apiFetch(`/merchants/${MERCHANT}/campaigns`)
}

export async function getCampaign(id: string): Promise<CampaignDetail> {
  const c = await apiFetch<CampaignDetail>(`/campaigns/${id}`)
  return {
    ...c,
    featured_items: c.featured_items.map((fi) => ({
      ...fi,
      image_url: resolveImageUrl(fi.image_url),
    })),
  }
}

export async function createBasket(payload: CreateBasketPayload): Promise<BasketDetail> {
  const { id } = await apiFetch<{ id: string }>('/baskets', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return apiFetch(`/baskets/${id}`)
}

export async function createCampaign(payload: CreateCampaignPayload): Promise<{ id: string }> {
  return apiFetch('/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
yarn jest __tests__/lib/api.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/api.ts __tests__/lib/api.test.ts
git commit -m "feat: add API client with resolveImageUrl and typed wrappers"
```

---

## Task 5: Zustand Cart Store (TDD)

**Files:**
- Create: `lib/store.ts`, `__tests__/lib/store.test.ts`

- [ ] **Step 1: Write tests**

```ts
// __tests__/lib/store.test.ts
import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@/lib/store'

const item1 = { item_id: 'outfit-1', name: 'Outfit 1', price_minor: 80000, image_url: '', qty: 1 }
const item2 = { item_id: 'outfit-2', name: 'Outfit 2', price_minor: 200000, image_url: '', qty: 1 }

beforeEach(() => {
  useCartStore.getState().clear()
})

describe('add', () => {
  it('adds a new item', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.add(item1))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].item_id).toBe('outfit-1')
  })
  it('merges qty when same item added twice', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.add(item1); result.current.add({ ...item1, qty: 2 }) })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].qty).toBe(3)
  })
})

describe('remove', () => {
  it('removes an item by id', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.add(item1); result.current.add(item2) })
    act(() => result.current.remove('outfit-1'))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].item_id).toBe('outfit-2')
  })
})

describe('updateQty', () => {
  it('updates quantity', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.add(item1))
    act(() => result.current.updateQty('outfit-1', 5))
    expect(result.current.items[0].qty).toBe(5)
  })
  it('removes item when qty set to 0', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.add(item1))
    act(() => result.current.updateQty('outfit-1', 0))
    expect(result.current.items).toHaveLength(0)
  })
})

describe('totalItems / totalMinor', () => {
  it('sums item quantities', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.add(item1); result.current.add({ ...item2, qty: 2 }) })
    expect(result.current.totalItems()).toBe(3)
  })
  it('sums price × qty', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.add(item1); result.current.add({ ...item2, qty: 2 }) })
    expect(result.current.totalMinor()).toBe(80000 + 200000 * 2)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
yarn jest __tests__/lib/store.test.ts
```

- [ ] **Step 3: Write `lib/store.ts`**

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  item_id: string
  name: string
  price_minor: number
  image_url: string
  qty: number
  item_note?: string | null
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  add: (item: CartItem) => void
  remove: (item_id: string) => void
  updateQty: (item_id: string, qty: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalMinor: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.item_id === item.item_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.item_id === item.item_id ? { ...i, qty: i.qty + item.qty } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      remove: (item_id) =>
        set((state) => ({ items: state.items.filter((i) => i.item_id !== item_id) })),
      updateQty: (item_id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.item_id !== item_id)
              : state.items.map((i) => (i.item_id === item_id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalMinor: () => get().items.reduce((sum, i) => sum + i.price_minor * i.qty, 0),
    }),
    {
      name: 'mensah-cart',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as Storage)
      ),
    }
  )
)
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
yarn jest __tests__/lib/store.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts __tests__/lib/store.test.ts
git commit -m "feat: add Zustand cart store with merge/remove/qty tests"
```

---

## Task 6: TanStack Query Hooks + Providers

**Files:**
- Create: `lib/queries.ts`, `app/providers.tsx`

- [ ] **Step 1: Write `lib/queries.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItems, getItem, getCampaigns, getCampaign, createCampaign } from '@/lib/api'
import type { CreateCampaignPayload } from '@/types/api'

export const KEYS = {
  items: ['items'] as const,
  item: (id: string) => ['item', id] as const,
  campaigns: ['campaigns'] as const,
  campaign: (id: string) => ['campaign', id] as const,
}

export function useItems() {
  return useQuery({ queryKey: KEYS.items, queryFn: getItems, staleTime: 5 * 60 * 1000 })
}

export function useItem(id: string) {
  return useQuery({ queryKey: KEYS.item(id), queryFn: () => getItem(id), staleTime: 5 * 60 * 1000 })
}

export function useCampaigns() {
  return useQuery({ queryKey: KEYS.campaigns, queryFn: getCampaigns, staleTime: 2 * 60 * 1000 })
}

export function useCampaign(id: string) {
  return useQuery({ queryKey: KEYS.campaign(id), queryFn: () => getCampaign(id) })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campaigns }),
  })
}
```

- [ ] **Step 2: Write `app/providers.tsx`**

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/queries.ts app/providers.tsx
git commit -m "feat: add TanStack Query hooks and client provider"
```

---

## Task 7: Root Layout + Navbar + Footer

**Files:**
- Create: `app/layout.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`

- [ ] **Step 1: Write `components/layout/Navbar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'

const LOGO = `${process.env.NEXT_PUBLIC_API_BASE}/images/mensah/logo.png`
const BASE = process.env.NEXT_PUBLIC_API_BASE!

export function Navbar() {
  const { totalItems, openCart } = useCartStore()
  const count = totalItems()

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8]/95 backdrop-blur border-b border-stone-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={`${BASE}/images/mensah/logo.png`}
            alt="Mensah"
            width={32}
            height={32}
            className="object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="font-serif text-lg tracking-[0.25em] text-stone-900 uppercase">Mensah</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-xs tracking-widest text-stone-500 uppercase hover:text-stone-900 transition-colors">Shop</Link>
          <Link href="/campaigns" className="text-xs tracking-widest text-stone-500 uppercase hover:text-stone-900 transition-colors">Campaigns</Link>
        </div>

        <button
          onClick={openCart}
          className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors"
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 text-white text-[10px] flex items-center justify-center rounded-full">
              {count}
            </span>
          )}
        </button>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Write `components/layout/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-24 py-12 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-serif tracking-[0.3em] text-sm text-stone-900 uppercase">Mensah</span>
        <p className="text-xs text-stone-400 tracking-wider">Tailored for the Occasion · Accra</p>
        <p className="text-xs text-stone-400">© {new Date().getFullYear()} Mensah Atelier</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { DM_Serif_Display, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from '@/components/ui/toaster'

const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-serif' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Mensah Atelier — Tailored Menswear',
  description: 'Luxury tailored menswear from Mensah Atelier. Shop bespoke suits, shirts, and occasion wear.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-[#fafaf8] text-stone-900 font-sans antialiased">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Add font CSS variables to `globals.css`**

Add to the existing `globals.css` (after `@tailwind` directives):
```css
:root {
  --font-serif: 'DM Serif Display', serif;
  --font-sans: 'Inter', sans-serif;
}

.font-serif {
  font-family: var(--font-serif);
}
```

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css components/layout/Navbar.tsx components/layout/Footer.tsx
git commit -m "feat: add root layout, Navbar, Footer"
```

---

## Task 8: Cart Drawer + Checkout Flow

**Files:**
- Create: `components/layout/CartDrawer.tsx`, `components/checkout/CheckoutForm.tsx`, `components/checkout/WhatsAppLink.tsx`

- [ ] **Step 1: Write `components/checkout/WhatsAppLink.tsx`**

```tsx
'use client'

import { buildWhatsAppLink, buildOrderMessage } from '@/lib/format'
import type { BasketDetail } from '@/types/api'

interface Props {
  basket: BasketDetail
  onClose: () => void
  onClearCart: () => void
}

export function WhatsAppLink({ basket, onClose, onClearCart }: Props) {
  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+233551856093')
  const message = buildOrderMessage(basket)
  const href = buildWhatsAppLink(waNumber, message)

  return (
    <div className="space-y-3 p-4 bg-stone-50 border border-stone-200 rounded">
      <p className="text-xs text-stone-500 tracking-wide">Order confirmed — ref: <strong>{basket.id}</strong></p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { onClearCart(); onClose() }}
        className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-medium tracking-wide hover:bg-[#20b857] transition-colors"
      >
        Continue to WhatsApp
      </a>
      <p className="text-[11px] text-stone-400 text-center">WhatsApp will open pre-filled with your order details</p>
    </div>
  )
}
```

- [ ] **Step 2: Write `components/checkout/CheckoutForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CheckoutFormValues {
  customer_name: string
  customer_phone: string
  customer_note: string
}

interface Props {
  onSubmit: (values: CheckoutFormValues) => void
  isLoading: boolean
}

export function CheckoutForm({ onSubmit, isLoading }: Props) {
  const [values, setValues] = useState<CheckoutFormValues>({
    customer_name: '', customer_phone: '', customer_note: '',
  })

  const set = (k: keyof CheckoutFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(values) }}
      className="space-y-3"
    >
      <div>
        <Label htmlFor="name" className="text-xs tracking-widest uppercase text-stone-500">Name</Label>
        <Input id="name" placeholder="Your name" value={values.customer_name} onChange={set('customer_name')} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="phone" className="text-xs tracking-widest uppercase text-stone-500">Phone</Label>
        <Input id="phone" type="tel" placeholder="+233..." value={values.customer_phone} onChange={set('customer_phone')} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="note" className="text-xs tracking-widest uppercase text-stone-500">Note</Label>
        <Input id="note" placeholder="Size, special requests…" value={values.customer_note} onChange={set('customer_note')} className="mt-1" />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Creating order…' : 'Order via WhatsApp'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Write `components/layout/CartDrawer.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { createBasket } from '@/lib/api'
import { CheckoutForm, type CheckoutFormValues } from '@/components/checkout/CheckoutForm'
import { WhatsAppLink } from '@/components/checkout/WhatsAppLink'
import type { BasketDetail } from '@/types/api'
import { useToast } from '@/hooks/use-toast'

const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG!
const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG!

export function CartDrawer() {
  const { items, isOpen, closeCart, remove, updateQty, clear, totalMinor } = useCartStore()
  const [basket, setBasket] = useState<BasketDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleCheckout(values: CheckoutFormValues) {
    if (items.length === 0) return
    setLoading(true)
    try {
      const result = await createBasket({
        merchant_id: MERCHANT,
        team_slug: TEAM_SLUG,
        items: items.map(({ item_id, qty, item_note }) => ({ item_id, qty, item_note })),
        customer_name: values.customer_name || null,
        customer_phone: values.customer_phone || null,
        customer_note: values.customer_note || null,
      })
      setBasket(result)
    } catch (err) {
      toast({ title: 'Order failed', description: (err as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    closeCart()
    setBasket(null)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="flex flex-col bg-[#fafaf8] w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-lg tracking-wider">Your Selection</SheetTitle>
        </SheetHeader>

        {items.length === 0 && !basket ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-stone-400 tracking-wide">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {!basket && items.map((item) => (
              <div key={item.item_id} className="flex gap-3">
                <div className="relative w-16 h-20 bg-stone-100 flex-shrink-0">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatPrice(item.price_minor)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.item_id, item.qty - 1)} className="p-1 border border-stone-200 hover:bg-stone-100">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.item_id, item.qty + 1)} className="p-1 border border-stone-200 hover:bg-stone-100">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => remove(item.item_id)} className="ml-auto p-1 text-stone-400 hover:text-stone-700">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!basket && (
              <>
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>{formatPrice(totalMinor())}</span>
                </div>
                <CheckoutForm onSubmit={handleCheckout} isLoading={loading} />
              </>
            )}

            {basket && (
              <WhatsAppLink basket={basket} onClose={handleClose} onClearCart={clear} />
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/CartDrawer.tsx components/checkout/CheckoutForm.tsx components/checkout/WhatsAppLink.tsx
git commit -m "feat: add cart drawer with checkout form and WhatsApp link"
```

---

## Task 9: ProductCard + MagazineGrid + ProductGrid

**Files:**
- Create: `components/product/ProductCard.tsx`, `components/product/MagazineGrid.tsx`, `components/product/ProductGrid.tsx`

- [ ] **Step 1: Write `components/product/ProductCard.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import type { Item } from '@/types/api'

interface Props {
  item: Item
  variant?: 'default' | 'large' | 'small'
}

export function ProductCard({ item, variant = 'default' }: Props) {
  const { add, openCart } = useCartStore()
  const imageUrl = item.image_urls?.[0] ?? ''

  const aspectClass = variant === 'large' ? 'aspect-[3/4]' : variant === 'small' ? 'aspect-square' : 'aspect-[3/4]'

  function handleAdd() {
    add({
      item_id: item.id,
      name: item.name,
      price_minor: item.price_minor,
      image_url: imageUrl,
      qty: 1,
    })
    openCart()
  }

  return (
    <div className="group">
      <Link href={`/products/${item.id}`} className="block">
        <div className={`relative ${aspectClass} bg-stone-100 overflow-hidden`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">No image</div>
          )}
          {!item.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Badge variant="outline" className="text-xs tracking-widest">Sold Out</Badge>
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm tracking-wide text-stone-800">{item.name}</p>
          <p className="text-xs text-stone-500">{formatPrice(item.price_minor)}</p>
        </div>
      </Link>
      <button
        onClick={handleAdd}
        disabled={!item.in_stock}
        className="mt-2 w-full py-2 text-xs tracking-widest uppercase border border-stone-200 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        {item.in_stock ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Write `components/product/MagazineGrid.tsx`**

```tsx
import { ProductCard } from './ProductCard'
import type { Item } from '@/types/api'

interface Props { items: Item[] }

export function MagazineGrid({ items }: Props) {
  if (items.length === 0) return null
  const [featured, second, third, ...rest] = items

  return (
    <div className="space-y-6">
      {/* Asymmetric hero row: 2/3 left + 1/3 right stacked */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {featured && <ProductCard item={featured} variant="large" />}
        </div>
        <div className="flex flex-col gap-4">
          {second && <ProductCard item={second} variant="small" />}
          {third && <ProductCard item={third} variant="small" />}
        </div>
      </div>

      {/* 3-col grid for remaining */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rest.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Write `components/product/ProductGrid.tsx`**

```tsx
import { ProductCard } from './ProductCard'
import type { Item } from '@/types/api'

interface Props { items: Item[] }

export function ProductGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/product/
git commit -m "feat: add ProductCard, MagazineGrid, ProductGrid"
```

---

## Task 10: Campaign Components

**Files:**
- Create: `components/campaign/CampaignStrip.tsx`, `components/campaign/CampaignCard.tsx`, `components/campaign/CreateCampaignForm.tsx`

- [ ] **Step 1: Write `components/campaign/CampaignStrip.tsx`**

```tsx
import Link from 'next/link'
import type { CampaignSummary } from '@/types/api'

interface Props { campaigns: CampaignSummary[] }

export function CampaignStrip({ campaigns }: Props) {
  if (campaigns.length === 0) return null
  const latest = campaigns[0]

  return (
    <div className="bg-stone-900 text-stone-200 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-xs tracking-[0.3em] uppercase">
          {latest.title}
          {latest.copy_text && <span className="ml-3 text-stone-400 normal-case tracking-normal">— {latest.copy_text}</span>}
        </p>
        <Link href={`/campaigns/${latest.id}`} className="text-xs tracking-widest uppercase text-stone-400 hover:text-white transition-colors">
          View →
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `components/campaign/CampaignCard.tsx`**

```tsx
import Link from 'next/link'
import type { CampaignSummary } from '@/types/api'

interface Props { campaign: CampaignSummary }

export function CampaignCard({ campaign }: Props) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="block border border-stone-200 p-6 hover:border-stone-400 transition-colors group">
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">Campaign</p>
      <h3 className="font-serif text-xl text-stone-900 group-hover:text-stone-600 transition-colors">{campaign.title}</h3>
      {campaign.copy_text && <p className="mt-2 text-sm text-stone-500 line-clamp-2">{campaign.copy_text}</p>}
      <p className="mt-4 text-xs text-stone-400">{new Date(campaign.created_at * 1000).toLocaleDateString('en-GH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </Link>
  )
}
```

- [ ] **Step 3: Write `components/campaign/CreateCampaignForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useCreateCampaign } from '@/lib/queries'
import { useItems } from '@/lib/queries'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG!
const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG!

export function CreateCampaignForm() {
  const [title, setTitle] = useState('')
  const [copyText, setCopyText] = useState('')
  const [featured, setFeatured] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCreateCampaign()
  const { data: items = [] } = useItems()
  const { toast } = useToast()

  function toggleItem(id: string) {
    setFeatured((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    mutate(
      { merchant_id: MERCHANT, team_slug: TEAM_SLUG, title: title.trim(), copy_text: copyText || null, featured_item_ids: featured.length ? featured : null },
      {
        onSuccess: () => { toast({ title: 'Campaign created' }); setTitle(''); setCopyText(''); setFeatured([]); setOpen(false) },
        onError: (err) => toast({ title: 'Failed', description: (err as Error).message, variant: 'destructive' }),
      }
    )
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs tracking-widest uppercase border border-stone-200 px-4 py-2 hover:bg-stone-900 hover:text-white transition-all">
        + New Campaign
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-stone-200 p-6 space-y-4 bg-white">
      <h3 className="font-serif text-lg">Create Campaign</h3>
      <div>
        <Label className="text-xs tracking-widest uppercase text-stone-500">Title *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign title" className="mt-1" required />
      </div>
      <div>
        <Label className="text-xs tracking-widest uppercase text-stone-500">Copy</Label>
        <Input value={copyText} onChange={(e) => setCopyText(e.target.value)} placeholder="Short promotional text" className="mt-1" />
      </div>
      <div>
        <Label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Featured Items</Label>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={featured.includes(item.id)} onChange={() => toggleItem(item.id)} className="accent-stone-900" />
              {item.name}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="px-6 py-2 bg-stone-900 text-white text-xs tracking-widest uppercase disabled:opacity-50">
          {isPending ? 'Creating…' : 'Create'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-6 py-2 border border-stone-200 text-xs tracking-widest uppercase">
          Cancel
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/campaign/
git commit -m "feat: add CampaignStrip, CampaignCard, CreateCampaignForm"
```

---

## Task 11: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useItems } from '@/lib/queries'
import { useCampaigns } from '@/lib/queries'
import { MagazineGrid } from '@/components/product/MagazineGrid'
import { CampaignStrip } from '@/components/campaign/CampaignStrip'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect } from 'react'
import { registerTeam } from '@/lib/api'

const BASE = process.env.NEXT_PUBLIC_API_BASE!

export default function HomePage() {
  const { data: items = [], isLoading: itemsLoading } = useItems()
  const { data: campaigns = [] } = useCampaigns()

  useEffect(() => { registerTeam() }, [])

  const heroItem = items[0]

  return (
    <>
      <CampaignStrip campaigns={campaigns} />

      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 order-2 md:order-1">
          <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-4">Mensah Atelier</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-stone-900 mb-8">
            Tailored for<br />the Occasion
          </h1>
          <p className="text-sm text-stone-500 mb-8 max-w-xs leading-relaxed">
            Precision-cut menswear for the man who understands that detail is everything.
          </p>
          <div className="flex gap-4">
            <Link href="/shop" className="px-8 py-3 bg-stone-900 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors">
              Shop the Collection
            </Link>
            <Link href="/campaigns" className="px-8 py-3 border border-stone-300 text-xs tracking-widest uppercase hover:border-stone-900 transition-colors">
              Campaigns
            </Link>
          </div>
        </div>
        <div className="relative bg-stone-100 min-h-[50vh] md:min-h-full order-1 md:order-2">
          {heroItem?.image_urls?.[0] && (
            <Image
              src={heroItem.image_urls[0]}
              alt="Mensah featured outfit"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </section>

      {/* Magazine grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl">The Edit</h2>
          <Link href="/shop" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-900 transition-colors">
            View All →
          </Link>
        </div>

        {itemsLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
          </div>
        ) : (
          <MagazineGrid items={items} />
        )}
      </section>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add homepage with hero, campaign strip, magazine grid"
```

---

## Task 12: Shop Page

**Files:**
- Create: `app/shop/page.tsx`

- [ ] **Step 1: Write `app/shop/page.tsx`**

```tsx
'use client'

import { useItems } from '@/lib/queries'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui/skeleton'

export default function ShopPage() {
  const { data: items = [], isLoading, isError } = useItems()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
        <h1 className="font-serif text-4xl">The Collection</h1>
        {!isLoading && <p className="text-sm text-stone-400 mt-2">{items.length} pieces</p>}
      </div>

      {isError && (
        <p className="text-sm text-red-500 py-8 text-center">Unable to load products. Please refresh.</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
        </div>
      ) : (
        <ProductGrid items={items} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/shop/page.tsx
git commit -m "feat: add shop page with full product grid"
```

---

## Task 13: Product Detail Page

**Files:**
- Create: `app/products/[id]/page.tsx`

- [ ] **Step 1: Write `app/products/[id]/page.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { use } from 'react'
import { useItem } from '@/lib/queries'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: item, isLoading, isError } = useItem(id)
  const { add, openCart } = useCartStore()

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
    </div>
  )

  if (isError || !item) return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-center">
      <p className="text-stone-500">Product not found.</p>
      <Link href="/shop" className="text-xs tracking-widest uppercase underline mt-4 inline-block">Back to Shop</Link>
    </div>
  )

  const imageUrl = item.image_urls?.[0] ?? ''

  function handleAdd() {
    add({ item_id: item.id, name: item.name, price_minor: item.price_minor, image_url: imageUrl, qty: 1 })
    openCart()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative aspect-[3/4] bg-stone-100">
        {imageUrl && <Image src={imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />}
        {!item.in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge variant="outline" className="text-xs tracking-widest">Sold Out</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center space-y-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
          <h1 className="font-serif text-3xl text-stone-900">{item.name}</h1>
          <p className="text-xl text-stone-600 mt-3">{formatPrice(item.price_minor)}</p>
        </div>

        <p className="text-sm text-stone-500 leading-relaxed">
          Precision-tailored to the highest standard. Each piece from Mensah Atelier is crafted for the modern gentleman.
        </p>

        <button
          onClick={handleAdd}
          disabled={!item.in_stock}
          className="py-4 bg-stone-900 text-white text-xs tracking-widest uppercase hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {item.in_stock ? 'Add to Cart' : 'Sold Out'}
        </button>

        <Link href="/shop" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors">
          ← Back to Collection
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/products/
git commit -m "feat: add product detail page"
```

---

## Task 14: Campaigns Pages

**Files:**
- Create: `app/campaigns/page.tsx`, `app/campaigns/[id]/page.tsx`

- [ ] **Step 1: Write `app/campaigns/page.tsx`**

```tsx
'use client'

import { useCampaigns } from '@/lib/queries'
import { CampaignCard } from '@/components/campaign/CampaignCard'
import { CreateCampaignForm } from '@/components/campaign/CreateCampaignForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading } = useCampaigns()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
          <h1 className="font-serif text-4xl">Campaigns</h1>
        </div>
        <CreateCampaignForm />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-200">
          <p className="text-sm text-stone-400 tracking-wide mb-4">No campaigns yet</p>
          <p className="text-xs text-stone-300">Create the first campaign above to feature your collection</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write `app/campaigns/[id]/page.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { useCampaign } from '@/lib/queries'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Skeleton } from '@/components/ui/skeleton'

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: campaign, isLoading, isError } = useCampaign(id)
  const { add, openCart } = useCartStore()

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-3 gap-4 mt-8">{[...Array(3)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
    </div>
  )

  if (isError || !campaign) return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-center">
      <p className="text-stone-500">Campaign not found.</p>
      <Link href="/campaigns" className="text-xs tracking-widest uppercase underline mt-4 inline-block">Back to Campaigns</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link href="/campaigns" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 mb-8 inline-block">← Campaigns</Link>
      <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Campaign</p>
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">{campaign.title}</h1>
      {campaign.copy_text && <p className="text-stone-500 text-lg leading-relaxed mb-10 max-w-xl">{campaign.copy_text}</p>}

      {campaign.featured_items.length > 0 && (
        <>
          <h2 className="font-serif text-2xl mb-6">Featured Pieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {campaign.featured_items.map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-sm tracking-wide">{item.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatPrice(item.price_minor)}</p>
                  <button
                    onClick={() => { add({ item_id: item.id, name: item.name, price_minor: item.price_minor, image_url: item.image_url ?? '', qty: 1 }); openCart() }}
                    disabled={!item.in_stock}
                    className="mt-2 w-full py-2 text-xs tracking-widest uppercase border border-stone-200 hover:bg-stone-900 hover:text-white disabled:opacity-40 transition-all"
                  >
                    {item.in_stock ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/campaigns/
git commit -m "feat: add campaigns list page with create form and campaign detail page"
```

---

## Task 15: Run All Tests + Fix Lint

**Files:** All test files

- [ ] **Step 1: Run full test suite**

```bash
yarn jest
```

Expected: All tests in `__tests__/lib/` pass.

- [ ] **Step 2: Run type check**

```bash
yarn tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Run lint**

```bash
yarn lint
```

Fix any ESLint errors before proceeding.

- [ ] **Step 4: Start dev server and smoke-test**

```bash
yarn dev
```

Verify manually:
- Homepage loads with hero and product grid
- `/shop` shows all 10 items
- `/products/outfit-1` shows product detail
- `/campaigns` shows empty state + create form
- Create a campaign → it appears in the list
- Add to cart → drawer opens → fill name/phone → "Order via WhatsApp" → WhatsApp link appears → click → cart clears

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: verify full test suite passes and app smoke-tested"
```

---

## Task 16: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

Create a public GitHub repo named `mensah-coded-hackathon` under the `jnopareboateng` account, then:

```bash
git remote add origin git@github-jnopareboateng:jnopareboateng/mensah-coded-hackathon.git
git push -u origin main
```

- [ ] **Step 2: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted: link to existing project or create new. Set the env vars in Vercel dashboard:
```
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=mensah
NEXT_PUBLIC_TEAM_SLUG=mensah
NEXT_PUBLIC_WHATSAPP_NUMBER=+233551856093
```

- [ ] **Step 3: Verify live URL**

Open the Vercel URL. Check all pages. Verify product images load, WhatsApp checkout flow works end to end.

- [ ] **Step 4: Collect submission info**

- Live URL: `https://mensah-coded-hackathon.vercel.app` (or assigned URL)
- GitHub repo: `https://github.com/jnopareboateng/mensah-coded-hackathon`
- Track: Mensah
- Coded Esports Username: [fill in]

Submit at: `https://forms.gle/qHU96yLwdUN7gYQdA`
