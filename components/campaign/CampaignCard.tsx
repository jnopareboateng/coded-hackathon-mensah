import Link from 'next/link'
import type { CampaignSummary } from '@/types/api'

interface Props {
  campaign: CampaignSummary
}

export function CampaignCard({ campaign }: Props) {
  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="block border border-stone-200 p-6 hover:border-stone-400 transition-colors group"
    >
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">Campaign</p>
      <h3 className="font-serif text-xl text-stone-900 group-hover:text-stone-600 transition-colors">
        {campaign.title}
      </h3>
      {campaign.copy_text && (
        <p className="mt-2 text-sm text-stone-500 line-clamp-2">{campaign.copy_text}</p>
      )}
      <p className="mt-4 text-xs text-stone-400">
        {new Date(campaign.created_at * 1000).toLocaleDateString('en-GH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </Link>
  )
}
