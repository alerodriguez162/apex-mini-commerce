import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

type Toast = { message: string } | null

type UiValue = {
  bagOpen: boolean
  openBag: () => void
  closeBag: () => void
  toast: Toast
  notify: (message: string) => void
  theme: Theme
  toggleTheme: () => void
}

const UiContext = createContext<UiValue | null>(null)
const THEME_KEY = 'orilla-theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

export function UiProvider({ children }: { children: ReactNode }) {
  const [bagOpen, setBagOpen] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY)
    const next = saved === 'dark' ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
  }, [])

  const notify = useCallback((message: string) => {
    setToast({ message })
    window.setTimeout(() => setToast(null), 2400)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_KEY, next)
      applyTheme(next)
      return next
    })
  }, [])

  return (
    <UiContext.Provider
      value={{
        bagOpen,
        openBag: () => setBagOpen(true),
        closeBag: () => setBagOpen(false),
        toast,
        notify,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </UiContext.Provider>
  )
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used within UiProvider')
  return ctx
}
