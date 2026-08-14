import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type WishlistContextValue = {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const KEY = 'orilla-wish'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed)) setIds(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids])

  const value = useMemo(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle: (id: string) =>
        setIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id])),
    }),
    [ids],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
