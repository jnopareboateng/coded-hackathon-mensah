'use client'

import { buildWhatsAppLink, buildOrderMessage } from '@/lib/format'
import type { BasketDetail } from '@/types/api'

interface Props {
  basket: BasketDetail
  onClose: () => void
  onClearCart: () => void
  onBack?: () => void
}

export function WhatsAppLink({ basket, onClose, onClearCart, onBack }: Props) {
  const fallback = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+233551856093'
  const waNumber = basket.merchant?.whatsapp_number || fallback
  const message = buildOrderMessage(basket)
  const href = buildWhatsAppLink(waNumber, message)

  return (
    <div className="space-y-4">
      {/* Order summary */}
      <div className="bg-stone-50 border border-stone-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400">Order Ready</p>
          <p className="text-[10px] text-stone-400 font-mono">#{basket.id.slice(0, 8)}</p>
        </div>

        <div className="space-y-1.5">
          {basket.items.map((item) => (
            <div key={item.item_id} className="flex justify-between text-xs">
              <span className="text-stone-600 truncate mr-2">
                {item.name}
                {item.qty > 1 && <span className="text-stone-400"> ×{item.qty}</span>}
              </span>
              <span className="text-stone-500 tabular-nums shrink-0">
                {(item.price_minor * item.qty / 100).toLocaleString('en-GH', {
                  minimumFractionDigits: 2,
                  style: 'currency',
                  currency: 'GHS',
                })}
              </span>
            </div>
          ))}
        </div>

        {basket.customer_name && (
          <p className="text-xs text-stone-500 pt-1 border-t border-stone-200">
            For: {basket.customer_name}
          </p>
        )}
      </div>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          onClearCart()
          onClose()
        }}
        className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#25D366] text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#20b857] active:bg-[#1da851] transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Send Order via WhatsApp
      </a>

      <p className="text-[11px] text-stone-400 text-center leading-relaxed">
        WhatsApp opens with your order pre-filled.
        <br />
        Your order reference is #{basket.id.slice(0, 8)}.
      </p>
    </div>
  )
}
