'use client'

import { buildWhatsAppLink, buildOrderMessage } from '@/lib/format'
import type { BasketDetail } from '@/types/api'

interface Props {
  basket: BasketDetail
  onClose: () => void
  onClearCart: () => void
}

export function WhatsAppLink({ basket, onClose, onClearCart }: Props) {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+233551856093'
  const message = buildOrderMessage(basket)
  const href = buildWhatsAppLink(waNumber, message)

  return (
    <div className="space-y-3 p-4 bg-stone-50 border border-stone-200 rounded">
      <p className="text-xs text-stone-500 tracking-wide">
        Order confirmed — ref: <strong>{basket.id}</strong>
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          onClearCart()
          onClose()
        }}
        className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-medium tracking-wide hover:bg-[#20b857] transition-colors"
      >
        Continue to WhatsApp
      </a>
      <p className="text-[11px] text-stone-400 text-center">
        WhatsApp will open pre-filled with your order details
      </p>
    </div>
  )
}
