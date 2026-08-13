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

export async function createOrder(input: {
  email: string
  items: Array<{ productId: string; qty: number }>
}) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    let message = 'No se pudo completar el pedido'
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // keep default
    }
    throw new Error(message)
  }
  return res.json() as Promise<{ id: string; total: number; email: string }>
}

export async function fetchOrder(id: string) {
  const res = await fetch(`/api/orders/${id}`)
  if (!res.ok) throw new Error('Pedido no encontrado')
  return res.json() as Promise<{
    id: string
    email: string
    total: number
    items: Array<{ name: string; qty: number; price: number }>
  }>
}
