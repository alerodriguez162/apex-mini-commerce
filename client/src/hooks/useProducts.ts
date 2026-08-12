import { startTransition, useEffect, useState } from 'react'
import { fetchProducts } from '../api'
import type { Product, ProductCategory } from '../types'

export function useProducts(category?: ProductCategory) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProducts(category)
      .then((data) => {
        if (!cancelled) startTransition(() => setProducts(data))
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  return { products, loading, error }
}
