import Link from 'next/link'
import Image from 'next/image'
import { resolveImageUrl } from '@/lib/api'
import type { CampaignSummary } from '@/types/api'

interface Props {
  campaign: CampaignSummary
}

export function CampaignCard({ campaign }: Props) {
  const imageUrl = campaign.image_urls?.[0] ? resolveImageUrl(campaign.image_urls[0]) : null

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="block border border-stone-200 hover:border-stone-400 transition-colors group overflow-hidden"
    >
      {/* Image strip */}
      {imageUrl && (
        <div className="relative h-48 bg-stone-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={campaign.title}
            fill
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-2">Campaign</p>
        <h3 className="font-serif text-xl text-stone-900 group-hover:text-stone-600 transition-colors leading-snug">
          {campaign.title}
        </h3>
        {campaign.copy_text && (
          <p className="mt-2 text-sm text-stone-500 line-clamp-2 leading-relaxed">
            {campaign.copy_text}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            {new Date(campaign.created_at * 1000).toLocaleDateString('en-GH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 group-hover:text-stone-700 transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
