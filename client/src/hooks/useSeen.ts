const KEY = 'orilla-seen'

export function rememberProduct(slug: string) {
  try {
    const raw = localStorage.getItem(KEY)
    const current = raw ? (JSON.parse(raw) as string[]) : []
    const next = [slug, ...current.filter((item) => item !== slug)].slice(0, 6)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

export function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}
