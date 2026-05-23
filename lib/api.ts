import type {
  Item,
  Merchant,
  CampaignSummary,
  CampaignDetail,
  CreateBasketPayload,
  BasketDetail,
  CreateCampaignPayload,
} from '@/types/api'

export const BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'https://api-hackathon.codedematrixtech.com'
export const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG ?? 'mensah'
export const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG ?? 'mensah'

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
    throw new Error((body as { message?: string }).message ?? `API error ${res.status}`)
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
    // 409 already registered — ignore
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
