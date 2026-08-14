import type { Product } from '../types'
import { useCartDispatch, useCartState } from './CartContext'

export function useCart() {
  const { items } = useCartState()
  const dispatch = useCartDispatch()
  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  return {
    items,
    count,
    total,
    add: (product: Product, qty = 1) => dispatch({ type: 'add', product, qty }),
    remove: (id: string) => dispatch({ type: 'remove', id }),
    setQty: (id: string, qty: number) => dispatch({ type: 'setQty', id, qty }),
    clear: () => dispatch({ type: 'clear' }),
  }
}
