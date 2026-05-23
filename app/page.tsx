'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useItems, useCampaigns } from '@/lib/queries'
import { MagazineGrid } from '@/components/product/MagazineGrid'
import { CampaignStrip } from '@/components/campaign/CampaignStrip'
import { Skeleton } from '@/components/ui/skeleton'
import { registerTeam } from '@/lib/api'

export default function HomePage() {
  const { data: items = [], isLoading: itemsLoading } = useItems()
  const { data: campaigns = [] } = useCampaigns()

  useEffect(() => {
    registerTeam()
  }, [])

  const heroItem = items[0]

  return (
    <>
      <CampaignStrip campaigns={campaigns} />

      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 order-2 md:order-1">
          <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-4">Mensah Atelier</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-stone-900 mb-8">
            Tailored for
            <br />
            the Occasion
          </h1>
          <p className="text-sm text-stone-500 mb-8 max-w-xs leading-relaxed">
            Precision-cut menswear for the man who understands that detail is everything.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/shop"
              className="px-8 py-3 bg-stone-900 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors"
            >
              Shop the Collection
            </Link>
            <Link
              href="/campaigns"
              className="px-8 py-3 border border-stone-300 text-xs tracking-widest uppercase hover:border-stone-900 transition-colors"
            >
              Campaigns
            </Link>
          </div>
        </div>
        <div className="relative bg-stone-100 min-h-[50vh] md:min-h-full order-1 md:order-2">
          {heroItem?.image_urls?.[0] && (
            <Image
              src={heroItem.image_urls[0]}
              alt="Mensah featured outfit"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </section>

      {/* Magazine grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl">The Edit</h2>
          <Link
            href="/shop"
            className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-900 transition-colors"
          >
            View All →
          </Link>
        </div>

        {itemsLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        ) : (
          <MagazineGrid items={items} />
        )}
      </section>
    </>
  )
}
