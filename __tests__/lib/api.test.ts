import { resolveImageUrl } from '@/lib/api'

describe('resolveImageUrl', () => {
  const BASE = 'https://api-hackathon.codedematrixtech.com'

  it('prepends base to relative paths', () => {
    expect(resolveImageUrl('/images/mensah/outfit1.jpeg')).toBe(
      `${BASE}/images/mensah/outfit1.jpeg`
    )
  })
  it('returns absolute URLs unchanged', () => {
    expect(resolveImageUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg')
  })
  it('returns empty string for empty input', () => {
    expect(resolveImageUrl('')).toBe('')
  })
  it('returns empty string for null input', () => {
    expect(resolveImageUrl(null)).toBe('')
  })
})
