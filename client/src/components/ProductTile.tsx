import { Link } from 'react-router-dom'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types'

export function ProductTile({ product }: { product: Product }) {
  return (
    <Link className="tile" to={`/tienda/${product.slug}`}>
      <div className="tile-visual" style={{ background: product.hue }} />
      <div className="tile-meta">
        <h2>{product.name}</h2>
        <p>
          {CATEGORY_LABELS[product.category]} · {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
