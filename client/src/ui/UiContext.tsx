import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type Toast = { message: string } | null

type UiValue = {
  bagOpen: boolean
  openBag: () => void
  closeBag: () => void
  toast: Toast
  notify: (message: string) => void
}

const UiContext = createContext<UiValue | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [bagOpen, setBagOpen] = useState(false)
  const [toast, setToast] = useState<Toast>(null)

  const notify = useCallback((message: string) => {
    setToast({ message })
    window.setTimeout(() => setToast(null), 2400)
  }, [])

  return (
    <UiContext.Provider
      value={{
        bagOpen,
        openBag: () => setBagOpen(true),
        closeBag: () => setBagOpen(false),
        toast,
        notify,
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
