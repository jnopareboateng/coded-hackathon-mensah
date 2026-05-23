import Link from 'next/link'
import type { CampaignSummary } from '@/types/api'

interface Props {
  campaigns: CampaignSummary[]
}

export function CampaignStrip({ campaigns }: Props) {
  if (campaigns.length === 0) return null
  const latest = campaigns[0]

  return (
    <div className="bg-stone-900 text-stone-200 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-xs tracking-[0.3em] uppercase">
          {latest.title}
          {latest.copy_text && (
            <span className="ml-3 text-stone-400 normal-case tracking-normal">
              — {latest.copy_text}
            </span>
          )}
        </p>
        <Link
          href={`/campaigns/${latest.id}`}
          className="text-xs tracking-widest uppercase text-stone-400 hover:text-white transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  )
}
