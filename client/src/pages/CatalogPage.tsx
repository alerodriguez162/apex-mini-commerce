import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductTile } from '../components/ProductTile'
import { SeenRail } from '../components/SeenRail'
import { useProducts } from '../hooks/useProducts'
import { CATEGORY_LABELS, type ProductCategory } from '../types'

const FILTERS: Array<ProductCategory | 'all'> = ['all', 'ropa', 'calzado', 'accesorios']
type SortKey = 'name' | 'price-asc' | 'price-desc'
type PriceBand = 'all' | 'under' | 'mid' | 'over'

export function CatalogPage() {
  const [params] = useSearchParams()
  const initial = params.get('cat')
  const [filter, setFilter] = useState<ProductCategory | 'all'>(
    initial === 'ropa' || initial === 'calzado' || initial === 'accesorios' ? initial : 'all',
  )
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('name')
  const [price, setPrice] = useState<PriceBand>('all')
  const deferredQuery = useDeferredValue(query)
  const { products, loading, error } = useProducts(filter === 'all' ? undefined : filter)

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    let filtered = q
      ? products.filter((product) =>
          `${product.name} ${product.description}`.toLowerCase().includes(q),
        )
      : products

    filtered = filtered.filter((product) => {
      if (price === 'under') return product.price < 1000
      if (price === 'mid') return product.price >= 1000 && product.price <= 2000
      if (price === 'over') return product.price > 2000
      return true
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
  }, [products, deferredQuery, sort, price])

  return (
    <main className="catalog">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1>Tienda</h1>
          <p className="lede">{loading ? 'Cargando…' : `${visible.length} piezas en la orilla`}</p>
        </div>
        <div className="toolbar">
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
        </div>
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
        <div className="filters" role="group" aria-label="Precio">
          {(
            [
              ['all', 'Cualquier precio'],
              ['under', 'Hasta $1,000'],
              ['mid', '$1,000 – $2,000'],
              ['over', 'Más de $2,000'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={price === value ? 'is-active' : undefined}
              onClick={() => setPrice(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      )}
      {!loading && visible.length === 0 && <p className="empty">Nada en esta orilla.</p>}

      {!loading && (
        <div className="grid">
          {visible.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
      <SeenRail />
    </main>
  )
}
