import type { Product, ProductCategory } from './types'

export async function fetchProducts(category?: ProductCategory): Promise<Product[]> {
  const query = category ? `?category=${category}` : ''
  const res = await fetch(`/api/products${query}`)
  if (!res.ok) throw new Error('No se pudo cargar el catálogo')
  return res.json() as Promise<Product[]>
}

export async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`/api/products/${slug}`)
  if (res.status === 404) throw new Error('Producto no encontrado')
  if (!res.ok) throw new Error('No se pudo cargar el producto')
  return res.json() as Promise<Product>
}
