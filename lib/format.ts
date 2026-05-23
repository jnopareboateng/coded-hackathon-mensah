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
  const sep = '—————————————'

  const itemLines = basket.items.map((item) => {
    const subtotal = formatPrice(item.price_minor * item.qty)
    const line = item.qty > 1
      ? `• ${item.name}\n  Qty: ${item.qty}  ·  ${subtotal}`
      : `• ${item.name}  ·  ${subtotal}`
    return item.item_note ? `${line}\n  Note: ${item.item_note}` : line
  })

  const parts: string[] = [
    `Hello Mensah Atelier! 👋`,
    `I'd like to place an order.`,
    ``,
    `*ORDER DETAILS*`,
    sep,
    ...itemLines,
    sep,
    `*Total: ${formatPrice(basket.total_minor)}*`,
  ]

  const hasCustomer = basket.customer_name || basket.customer_phone
  if (hasCustomer) {
    parts.push(``, `*CUSTOMER*`)
    if (basket.customer_name) parts.push(`Name: ${basket.customer_name}`)
    if (basket.customer_phone) parts.push(`Phone: ${basket.customer_phone}`)
  }

  if (basket.customer_note) {
    parts.push(``, `*SPECIAL INSTRUCTIONS*`, basket.customer_note)
  }

  parts.push(``, `Ref: ${basket.id}`)

  return parts.join('\n')
}
