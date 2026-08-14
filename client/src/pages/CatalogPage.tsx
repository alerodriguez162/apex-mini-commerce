import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { ProductTile } from '../components/ProductTile'
import { useProducts } from '../hooks/useProducts'
import { CATEGORY_LABELS, type ProductCategory } from '../types'

const FILTERS: Array<ProductCategory | 'all'> = ['all', 'ropa', 'calzado', 'accesorios']

export function CatalogPage() {
  const [filter, setFilter] = useState<ProductCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const { products, loading, error } = useProducts(filter === 'all' ? undefined : filter)

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter((product) =>
      `${product.name} ${product.description}`.toLowerCase().includes(q),
    )
  }, [products, deferredQuery])

  return (
    <main className="catalog">
      <header className="catalog-header">
        <h1>Tienda</h1>
        <label className="search">
          Buscar
          <input
            type="search"
            value={query}
            placeholder="Lino, palma, yute…"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
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
      {!loading && visible.length === 0 && <p className="empty">Nada en esta orilla.</p>}

      <div className="grid">
        {visible.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
