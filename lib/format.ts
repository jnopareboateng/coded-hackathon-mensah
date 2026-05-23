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
