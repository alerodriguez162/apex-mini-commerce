import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductTile } from '../components/ProductTile'
import { useProducts } from '../hooks/useProducts'
import { CATEGORY_LABELS, type ProductCategory } from '../types'

const FILTERS: Array<ProductCategory | 'all'> = ['all', 'ropa', 'calzado', 'accesorios']
type SortKey = 'name' | 'price-asc' | 'price-desc'

export function CatalogPage() {
  const [params] = useSearchParams()
  const initial = params.get('cat')
  const [filter, setFilter] = useState<ProductCategory | 'all'>(
    initial === 'ropa' || initial === 'calzado' || initial === 'accesorios' ? initial : 'all',
  )
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('name')
  const deferredQuery = useDeferredValue(query)
  const { products, loading, error } = useProducts(filter === 'all' ? undefined : filter)

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const filtered = q
      ? products.filter((product) =>
          `${product.name} ${product.description}`.toLowerCase().includes(q),
        )
      : products

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
  }, [products, deferredQuery, sort])

  return (
    <main className="catalog">
      <header className="catalog-header">
        <div>
          <h1>Tienda</h1>
          <p className="lede">{loading ? '…' : `${visible.length} piezas`}</p>
        </div>
        <label className="search">
          Buscar
          <input
            type="search"
            value={query}
            placeholder="Lino, palma, yute…"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="search">
          Orden
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="name">Nombre</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
          </select>
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
