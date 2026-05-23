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
