import { Link } from 'react-router-dom'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types'
import { useWishlist } from '../wishlist/WishlistContext'
import { ProductArt } from './ProductArt'

export function ProductTile({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { has, toggle } = useWishlist()
  const wished = has(product.id)

  function prefetch() {
    void import('../pages/ProductPage')
    void fetch(`/api/products/${product.slug}`)
  }

  return (
    <article className={`tile ${featured ? 'tile-featured' : ''}`}>
      <Link to={`/tienda/${product.slug}`} onMouseEnter={prefetch}>
        <ProductArt product={product} />
        {product.stock <= 8 && <span className="badge">Pocas piezas</span>}
      </Link>
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
    </article>
  )
}
