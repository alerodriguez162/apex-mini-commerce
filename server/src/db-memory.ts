import type { Product, ProductCategory } from './types.js'
import { PRODUCT_SEED } from './seed.js'

export type ProductFilters = {
  category?: ProductCategory
}

export type OrderItemInput = {
  productId: string
  qty: number
}

export type Order = {
  id: string
  email: string
  total: number
  createdAt: string
  items: Array<{
    productId: string
    name: string
    qty: number
    price: number
  }>
}

const products = new Map<string, Product>(PRODUCT_SEED.map((p) => [p.id, { ...p }]))
const orders = new Map<string, Order>()

export function listProducts(filters: ProductFilters = {}): Product[] {
  const all = [...products.values()].sort((a, b) => a.name.localeCompare(b.name))
  if (!filters.category) return all
  return all.filter((p) => p.category === filters.category)
}

export function getProductBySlug(slug: string): Product | undefined {
  return [...products.values()].find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.get(id)
}

export function createOrder(email: string, items: OrderItemInput[]): Order {
  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const resolved = items.map((item) => {
    const product = getProductById(item.productId)
    if (!product) throw new Error(`Product not found: ${item.productId}`)
    if (item.qty < 1) throw new Error('Quantity must be at least 1')
    if (item.qty > product.stock) throw new Error(`Sin stock suficiente: ${product.name}`)
    return { product, qty: item.qty }
  })
  const total = resolved.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  for (const item of resolved) {
    const current = products.get(item.product.id)!
    products.set(item.product.id, { ...current, stock: current.stock - item.qty })
  }

  const order: Order = {
    id,
    email,
    total,
    createdAt: now,
    items: resolved.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      qty: item.qty,
      price: item.product.price,
    })),
  }
  orders.set(id, order)
  return order
}

export function getOrderById(id: string): Order | undefined {
  return orders.get(id)
}
