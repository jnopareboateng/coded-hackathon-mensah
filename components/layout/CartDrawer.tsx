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

const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG ?? 'mensah'
const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG ?? 'mensah'

export function CartDrawer() {
  const { items, isOpen, closeCart, remove, updateQty, updateNote, clear, totalMinor } = useCartStore()
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
      toast({
        title: 'Order failed',
        description: (err as Error).message,
        variant: 'destructive',
      })
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
            {!basket &&
              items.map((item) => (
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
                      <button
                        onClick={() => updateQty(item.item_id, item.qty - 1)}
                        className="p-1 border border-stone-200 hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.item_id, item.qty + 1)}
                        className="p-1 border border-stone-200 hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => remove(item.item_id)}
                        className="ml-auto p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.item_note ?? ''}
                      onChange={(e) => updateNote(item.item_id, e.target.value)}
                      placeholder="Size or note…"
                      className="mt-2 w-full text-xs border-b border-stone-200 focus:border-stone-900 outline-none py-1 bg-transparent text-stone-600 placeholder:text-stone-300 transition-colors"
                    />
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
