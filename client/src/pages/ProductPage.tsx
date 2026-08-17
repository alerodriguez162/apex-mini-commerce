import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct, fetchProducts } from '../api'
import { useCart } from '../cart/useCart'
import { ProductArt } from '../components/ProductArt'
import { ProductTile } from '../components/ProductTile'
import { SeenRail } from '../components/SeenRail'
import { rememberProduct } from '../hooks/useSeen'
import { useUi } from '../ui/UiContext'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types'
import { useWishlist } from '../wishlist/WishlistContext'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export function ProductPage() {
  const { slug = '' } = useParams()
  const { add } = useCart()
  const { notify, openBag } = useUi()
  const { has, toggle } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('M')

  useEffect(() => {
    let cancelled = false
    setProduct(null)
    setError(null)
    setQty(1)
    fetchProduct(slug)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        rememberProduct(data.slug)
        return fetchProducts(data.category).then((list) => {
          if (!cancelled) {
            setRelated(list.filter((item) => item.slug !== data.slug).slice(0, 3))
          }
        })
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const wished = product ? has(product.id) : false
  const needsSize = product?.category === 'ropa' || product?.category === 'calzado'

  const stockLabel = useMemo(() => {
    if (!product) return ''
    if (product.stock <= 8) return `Quedan ${product.stock} en taller`
    return `${product.stock} en taller`
  }, [product])

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
    <>
      <main className="detail">
        <ProductArt product={product} className="art-hero" />
        <div className="detail-copy card">
          <p className="eyebrow">{CATEGORY_LABELS[product.category]}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>
          <p className="price">{formatPrice(product.price)}</p>

          {needsSize && (
            <div className="sizes">
              {SIZES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={size === value ? 'is-active' : undefined}
                  onClick={() => setSize(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          )}

          <div className="qty-row">
            <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))}>
              −
            </button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((n) => Math.min(product.stock, n + 1))}>
              +
            </button>
          </div>

          <div className="pdp-actions">
            <button
              type="button"
              className="cta-btn"
              onClick={() => {
                add(product, qty)
                notify(needsSize ? `${product.name} · talla ${size}` : `${product.name} en la bolsa`)
                openBag()
              }}
            >
              Agregar a la bolsa
            </button>
            <button type="button" className={`wish lg ${wished ? 'is-on' : ''}`} onClick={() => toggle(product.id)}>
              {wished ? 'En deseos' : 'Guardar'}
            </button>
          </div>
          <p className="stock">{stockLabel}</p>
        </div>
      </main>
      {related.length > 0 && (
        <section className="home-block">
          <header className="block-head">
            <h2>Junto a esta pieza</h2>
          </header>
          <div className="grid">
            {related.map((item) => (
              <ProductTile key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
      <SeenRail exclude={product.slug} />
    </>
  )
}
