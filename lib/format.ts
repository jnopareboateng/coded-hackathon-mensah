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
  const lines = basket.items.map((item) => {
    const line = `• ${item.name} x${item.qty} — ${formatPrice(item.price_minor * item.qty)}`
    return item.item_note ? `${line} (${item.item_note})` : line
  })

  const parts = [`Hello! I'd like to place an order with Mensah Atelier:`]
  if (basket.customer_name) parts.push(`Name: ${basket.customer_name}`)
  if (basket.customer_phone) parts.push(`Phone: ${basket.customer_phone}`)
  parts.push('', ...lines, '', `Total: ${formatPrice(basket.total_minor)}`)
  if (basket.customer_note) parts.push(`Note: ${basket.customer_note}`)
  parts.push(`Ref: ${basket.id}`)
  return parts.join('\n')
}
