import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../api'
import { ProductTile } from '../components/ProductTile'
import type { Product } from '../types'
import { useWishlist } from '../wishlist/WishlistContext'

export function WishlistPage() {
  const { ids } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then((all) => setProducts(all.filter((item) => ids.includes(item.id))))
  }, [ids])

  return (
    <main className="catalog">
      <h1>Deseos</h1>
      {ids.length === 0 ? (
        <p className="empty">
          Nada guardado. <Link to="/tienda">Ir a la tienda</Link>
        </p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
