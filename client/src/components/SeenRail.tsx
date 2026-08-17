import { useEffect, useState } from 'react'
import { fetchProducts } from '../api'
import { readSeen } from '../hooks/useSeen'
import type { Product } from '../types'
import { ProductTile } from './ProductTile'

export function SeenRail({ exclude }: { exclude?: string }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    const slugs = readSeen().filter((slug) => slug !== exclude)
    if (slugs.length === 0) {
      setItems([])
      return
    }
    fetchProducts().then((all) => {
      setItems(slugs.map((slug) => all.find((p) => p.slug === slug)).filter(Boolean) as Product[])
    })
  }, [exclude])

  if (items.length === 0) return null

  return (
    <section className="home-block">
      <header className="block-head">
        <div>
          <p className="eyebrow">Memoria de la orilla</p>
          <h2>Vistos recientemente</h2>
        </div>
      </header>
      <div className="grid">
        {items.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
