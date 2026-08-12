import { startTransition, useState } from 'react'
import { ProductTile } from '../components/ProductTile'
import { useProducts } from '../hooks/useProducts'
import { CATEGORY_LABELS, type ProductCategory } from '../types'

const FILTERS: Array<ProductCategory | 'all'> = ['all', 'ropa', 'calzado', 'accesorios']

export function CatalogPage() {
  const [filter, setFilter] = useState<ProductCategory | 'all'>('all')
  const { products, loading, error } = useProducts(filter === 'all' ? undefined : filter)

  return (
    <main className="catalog">
      <header className="catalog-header">
        <h1>Tienda</h1>
        <div className="filters" role="tablist">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'is-active' : undefined}
              onClick={() => startTransition(() => setFilter(value))}
            >
              {value === 'all' ? 'Todo' : CATEGORY_LABELS[value]}
            </button>
          ))}
        </div>
      </header>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Cargando piezas…</p>}
      {!loading && products.length === 0 && <p className="empty">Nada en esta orilla.</p>}

      <div className="grid">
        {products.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
