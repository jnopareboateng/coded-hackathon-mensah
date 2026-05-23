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
      {
        item_id: 'outfit-1',
        name: 'Outfit 1',
        price_minor: 80000,
        currency: 'GHS',
        image_url: null,
        in_stock: true,
        qty: 2,
        item_note: null,
      },
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
    expect(buildOrderMessage(basket)).toContain('Outfit 1 x2')
  })
  it('includes total', () => {
    expect(buildOrderMessage(basket)).toContain('1,600.00')
  })
  it('includes basket id', () => {
    expect(buildOrderMessage(basket)).toContain('abc123')
  })
  it('includes customer name when present', () => {
    expect(buildOrderMessage(basket)).toContain('Kwame')
  })
  it('includes customer phone when present', () => {
    const msg = buildOrderMessage({ ...basket, customer_phone: '+233201234567' })
    expect(msg).toContain('+233201234567')
  })
  it('includes customer note when present', () => {
    const msg = buildOrderMessage({ ...basket, customer_note: 'Please deliver by Friday' })
    expect(msg).toContain('Please deliver by Friday')
  })
  it('includes item_note inline with the item line', () => {
    const items = [{ ...basket.items[0], item_note: 'Size 42' }]
    const msg = buildOrderMessage({ ...basket, items })
    expect(msg).toContain('Size 42')
    expect(msg).toContain('Outfit 1 x2')
  })
  it('uses merchant whatsapp_number when building link', () => {
    const link = buildWhatsAppLink('+233200000001', 'test')
    expect(link).toContain('wa.me/233200000001')
  })
})
