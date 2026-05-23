'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
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
  const { items, isOpen, closeCart, remove, updateQty, updateNote, clear, totalMinor, totalItems } =
    useCartStore()
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
    // Only reset basket view if the order was completed (cart already cleared by WhatsAppLink)
    if (items.length === 0) setBasket(null)
  }

  const count = totalItems()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="flex flex-col bg-[#fafaf8] w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-stone-100">
          <SheetTitle className="font-serif text-lg tracking-wider flex items-center justify-between">
            <span>Your Selection</span>
            {count > 0 && (
              <span className="text-xs font-normal text-stone-400 tracking-widest">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 && !basket ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 py-12 px-6">
            <ShoppingBag className="w-10 h-10 text-stone-200" />
            <div className="text-center">
              <p className="text-sm text-stone-500 tracking-wide">Your selection is empty</p>
              <p className="text-xs text-stone-400 mt-1">Add pieces from the collection</p>
            </div>
            <Link
              href="/shop"
              onClick={closeCart}
              className="text-[11px] tracking-[0.3em] uppercase border border-stone-200 px-8 py-3 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* Order confirmation view */}
            {basket ? (
              <WhatsAppLink basket={basket} onClose={handleClose} onClearCart={clear} />
            ) : (
              <>
                {/* Cart items */}
                {items.map((item) => (
                  <div key={item.item_id} className="flex gap-3">
                    <div className="relative w-16 h-20 bg-stone-100 flex-shrink-0">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover object-top"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <button
                          onClick={() => remove(item.item_id)}
                          className="shrink-0 p-0.5 text-stone-300 hover:text-stone-700 cursor-pointer transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formatPrice(item.price_minor)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.item_id, item.qty - 1)}
                          className="w-7 h-7 border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-5 text-center tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.item_id, item.qty + 1)}
                          className="w-7 h-7 border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="ml-auto text-xs text-stone-500 tabular-nums">
                          {formatPrice(item.price_minor * item.qty)}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={item.item_note ?? ''}
                        onChange={(e) => updateNote(item.item_id, e.target.value)}
                        placeholder="Size or note…"
                        maxLength={120}
                        className="mt-2 w-full text-xs border-b border-stone-200 focus:border-stone-900 outline-none py-1 bg-transparent text-stone-600 placeholder:text-stone-300 transition-colors"
                      />
                    </div>
                  </div>
                ))}

                {/* Totals + checkout */}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Total</span>
                  <span className="font-medium tabular-nums">{formatPrice(totalMinor())}</span>
                </div>
                <p className="text-[11px] text-stone-400 -mt-2">
                  Complete your order details below
                </p>
                <CheckoutForm onSubmit={handleCheckout} isLoading={loading} />
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
