import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import type { Product } from '../types'

export type CartItem = {
  product: Product
  qty: number
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; id: string }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'hydrate'; items: CartItem[] }
  | { type: 'clear' }

const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null)

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'hydrate':
      return { items: action.items }
    case 'add': {
      const existing = state.items.find((item) => item.product.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, qty: Math.min(item.qty + 1, item.product.stock) }
              : item,
          ),
        }
      }
      return { items: [...state.items, { product: action.product, qty: 1 }] }
    }
    case 'remove':
      return { items: state.items.filter((item) => item.product.id !== action.id) }
    case 'setQty':
      if (action.qty < 1) {
        return { items: state.items.filter((item) => item.product.id !== action.id) }
      }
      return {
        items: state.items.map((item) =>
          item.product.id === action.id
            ? { ...item, qty: Math.min(action.qty, item.product.stock) }
            : item,
        ),
      }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

const STORAGE_KEY = 'orilla-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      if (Array.isArray(parsed)) dispatch({ type: 'hydrate', items: parsed })
    } catch {
      // ignore corrupt storage
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

export function useCartState() {
  const ctx = useContext(CartStateContext)
  if (!ctx) throw new Error('useCartState must be used within CartProvider')
  return ctx
}

export function useCartDispatch() {
  const ctx = useContext(CartDispatchContext)
  if (!ctx) throw new Error('useCartDispatch must be used within CartProvider')
  return ctx
}
