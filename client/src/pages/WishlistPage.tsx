import { useEffect, useState } from 'react'
import { fetchProducts } from '../api'
import { EmptyState } from '../components/EmptyState'
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
        <EmptyState
          title="Nada anclado aún"
          copy="Guarda las piezas que quieras volver a ver cuando baje la marea."
        />
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
