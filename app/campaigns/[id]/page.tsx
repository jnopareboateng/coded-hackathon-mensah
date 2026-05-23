'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { useCampaign } from '@/lib/queries'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Skeleton } from '@/components/ui/skeleton'

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: campaign, isLoading, isError } = useCampaign(id)
  const { add, openCart } = useCartStore()

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !campaign) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-stone-500">Campaign not found.</p>
        <Link
          href="/campaigns"
          className="text-xs tracking-widest uppercase underline mt-4 inline-block"
        >
          Back to Campaigns
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link
        href="/campaigns"
        className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 mb-8 inline-block"
      >
        ← Campaigns
      </Link>
      <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Campaign</p>
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">{campaign.title}</h1>
      {campaign.copy_text && (
        <p className="text-stone-500 text-lg leading-relaxed mb-10 max-w-xl">
          {campaign.copy_text}
        </p>
      )}

      {campaign.featured_items.length > 0 && (
        <>
          <h2 className="font-serif text-2xl mb-6">Featured Pieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {campaign.featured_items.map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  {item.image_url && (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      sizes="33vw"
                    />
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-sm tracking-wide">{item.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatPrice(item.price_minor)}</p>
                  <button
                    onClick={() => {
                      add({
                        item_id: item.id,
                        name: item.name,
                        price_minor: item.price_minor,
                        image_url: item.image_url ?? '',
                        qty: 1,
                      })
                      openCart()
                    }}
                    disabled={!item.in_stock}
                    className="mt-2 w-full py-2 text-xs tracking-widest uppercase border border-stone-200 hover:bg-stone-900 hover:text-white disabled:opacity-40 transition-all cursor-pointer"
                  >
                    {item.in_stock ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
