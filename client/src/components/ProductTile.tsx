import { Link } from 'react-router-dom'
import type { MouseEvent } from 'react'
import { useCart } from '../cart/useCart'
import { useUi } from '../ui/UiContext'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types'
import { useWishlist } from '../wishlist/WishlistContext'
import { ProductArt } from './ProductArt'

type ProductTileProps = {
  product: Product
  featured?: boolean
  compact?: boolean
}

export function ProductTile({ product, featured = false, compact = false }: ProductTileProps) {
  const { has, toggle } = useWishlist()
  const { add } = useCart()
  const { notify, openBag } = useUi()
  const wished = has(product.id)

  function prefetch() {
    void import('../pages/ProductPage')
    void fetch(`/api/products/${product.slug}`)
  }

  function quickAdd(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    add(product)
    notify(`${product.name} en la bolsa`)
    openBag()
  }

  return (
    <article className={`tile ${featured ? 'tile-featured' : ''} ${compact ? 'tile-compact' : ''}`}>
      <Link className="tile-media" to={`/tienda/${product.slug}`} onMouseEnter={prefetch}>
        <ProductArt product={product} />
        {product.stock <= 8 && <span className="badge">Pocas piezas</span>}
        {!compact && (
          <span className="tile-actions">
            <span className="tile-hover">Ver pieza</span>
            <button type="button" className="tile-add" onClick={quickAdd}>
              + Bolsa
            </button>
          </span>
        )}
      </Link>
      {!compact && (
        <div className="tile-meta">
          <div>
            <h2>
              <Link to={`/tienda/${product.slug}`}>{product.name}</Link>
            </h2>
            <p>
              {CATEGORY_LABELS[product.category]} · {formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            className={`wish ${wished ? 'is-on' : ''}`}
            aria-label={wished ? 'Quitar de deseos' : 'Guardar'}
            onClick={() => toggle(product.id)}
          >
            {wished ? '♥' : '♡'}
          </button>
        </div>
      )}
    </article>
  )
}
