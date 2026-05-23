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

      {/* Hero — editorial split, image dominant */}
      <section className="grid grid-cols-1 md:grid-cols-[42%_58%] min-h-[100svh] md:min-h-[92vh]">
        {/* Text column */}
        <div className="flex flex-col justify-end md:justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24 order-2 md:order-1 bg-[#fafaf8]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-px bg-stone-400" />
              <p className="text-[10px] tracking-[0.45em] text-stone-400 uppercase">
                Mensah Atelier · Accra
              </p>
            </div>

            <h1 className="font-serif leading-[1.0] text-stone-900 mb-6"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)' }}>
              Tailored<br />
              for the<br />
              Occasion
            </h1>

            <div className="w-10 h-px bg-stone-300 mb-6" />

            <p className="text-sm text-stone-500 mb-10 leading-relaxed max-w-[26ch]">
              Precision-cut menswear for the man who understands that detail is everything.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.28em] uppercase hover:bg-stone-700 transition-colors text-center"
              >
                Shop the Collection
              </Link>
              <Link
                href="/campaigns"
                className="px-8 py-3.5 border border-stone-300 text-[11px] tracking-[0.28em] uppercase hover:border-stone-900 hover:text-stone-900 transition-colors text-center text-stone-500"
              >
                Campaigns
              </Link>
            </div>

            {/* Editorial counter */}
            <div className="mt-16 flex items-center gap-3 text-stone-300">
              <span className="font-serif text-[11px]">01</span>
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[10px] tracking-[0.4em] uppercase">New Collection</span>
            </div>
          </div>
        </div>

        {/* Image column — object-top to show collar/full garment */}
        <div className="relative bg-stone-100 min-h-[60svh] md:min-h-full order-1 md:order-2 overflow-hidden">
          {heroItem?.image_urls?.[0] ? (
            <Image
              src={heroItem.image_urls[0]}
              alt="Mensah featured outfit"
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          ) : (
            <div className="absolute inset-0 bg-stone-100" />
          )}
          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-900/15 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* The Edit section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-12">
          <div className="flex items-baseline gap-6">
            <span className="font-serif text-stone-200 text-6xl leading-none select-none">02</span>
            <div>
              <h2 className="font-serif text-3xl text-stone-900">The Edit</h2>
              <p className="text-[11px] tracking-[0.35em] uppercase text-stone-400 mt-1">
                Curated selection
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-[11px] tracking-[0.3em] uppercase text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2"
          >
            View All
            <span className="text-base leading-none">→</span>
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
