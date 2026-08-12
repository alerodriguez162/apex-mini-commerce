import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../api'
import { useCart } from '../cart/useCart'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types'

export function ProductPage() {
  const { slug = '' } = useParams()
  const { add } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let cancelled = false
    setProduct(null)
    setError(null)
    setAdded(false)
    fetchProduct(slug)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (error) {
    return (
      <main className="detail">
        <p className="error">{error}</p>
        <Link to="/tienda">Volver</Link>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="detail">
        <p className="empty">Cargando…</p>
      </main>
    )
  }

  return (
    <main className="detail">
      <div className="detail-visual" style={{ background: product.hue }} />
      <div className="detail-copy">
        <p className="eyebrow">{CATEGORY_LABELS[product.category]}</p>
        <h1>{product.name}</h1>
        <p className="lede">{product.description}</p>
        <p className="price">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="cta-btn"
          onClick={() => {
            add(product)
            setAdded(true)
          }}
        >
          {added ? 'En la bolsa' : 'Agregar a la bolsa'}
        </button>
        <p className="stock">{product.stock} en taller</p>
      </div>
    </main>
  )
}
