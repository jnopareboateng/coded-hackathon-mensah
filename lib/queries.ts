import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItems, getItem, getCampaigns, getCampaign, createCampaign } from '@/lib/api'
import type { CreateCampaignPayload } from '@/types/api'

export const KEYS = {
  items: ['items'] as const,
  item: (id: string) => ['item', id] as const,
  campaigns: ['campaigns'] as const,
  campaign: (id: string) => ['campaign', id] as const,
}

export function useItems() {
  return useQuery({ queryKey: KEYS.items, queryFn: getItems, staleTime: 5 * 60 * 1000 })
}

export function useItem(id: string) {
  return useQuery({
    queryKey: KEYS.item(id),
    queryFn: () => getItem(id),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCampaigns() {
  return useQuery({
    queryKey: KEYS.campaigns,
    queryFn: getCampaigns,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCampaign(id: string) {
  return useQuery({ queryKey: KEYS.campaign(id), queryFn: () => getCampaign(id) })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campaigns }),
  })
}
