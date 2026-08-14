import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Product, ProductCategory } from './types.js'
import { PRODUCT_SEED } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
const dbPath = path.join(dataDir, 'store.db')

fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    hue TEXT NOT NULL,
    stock INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    total INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
`)

type ProductRow = Product

const count = db.prepare('SELECT COUNT(*) as n FROM products').get() as { n: number }
if (count.n === 0) {
  const insert = db.prepare(
    `INSERT INTO products (id, slug, name, description, price, category, hue, stock)
     VALUES (@id, @slug, @name, @description, @price, @category, @hue, @stock)`,
  )
  const tx = db.transaction((rows: Product[]) => {
    for (const row of rows) insert.run(row)
  })
  tx(PRODUCT_SEED)
}

export type ProductFilters = {
  category?: ProductCategory
}

export function listProducts(filters: ProductFilters = {}): Product[] {
  if (filters.category) {
    return db
      .prepare(
        `SELECT id, slug, name, description, price, category, hue, stock
         FROM products WHERE category = ? ORDER BY name`,
      )
      .all(filters.category) as ProductRow[]
  }

  return db
    .prepare(
      `SELECT id, slug, name, description, price, category, hue, stock
       FROM products ORDER BY name`,
    )
    .all() as ProductRow[]
}

export function getProductBySlug(slug: string): Product | undefined {
  return db
    .prepare(
      `SELECT id, slug, name, description, price, category, hue, stock
       FROM products WHERE slug = ?`,
    )
    .get(slug) as ProductRow | undefined
}

export function getProductById(id: string): Product | undefined {
  return db
    .prepare(
      `SELECT id, slug, name, description, price, category, hue, stock
       FROM products WHERE id = ?`,
    )
    .get(id) as ProductRow | undefined
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

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO orders (id, email, total, created_at) VALUES (?, ?, ?, ?)`,
    ).run(id, email, total, now)

    const insertItem = db.prepare(
      `INSERT INTO order_items (id, order_id, product_id, qty, price)
       VALUES (?, ?, ?, ?, ?)`,
    )
    const updateStock = db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`)

    for (const item of resolved) {
      insertItem.run(crypto.randomUUID(), id, item.product.id, item.qty, item.product.price)
      updateStock.run(item.qty, item.product.id)
    }
  })
  tx()

  return {
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
}

export function getOrderById(id: string): Order | undefined {
  const order = db
    .prepare(`SELECT id, email, total, created_at FROM orders WHERE id = ?`)
    .get(id) as { id: string; email: string; total: number; created_at: string } | undefined
  if (!order) return undefined

  const items = db
    .prepare(
      `SELECT oi.product_id as productId, p.name as name, oi.qty as qty, oi.price as price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
    )
    .all(id) as Order['items']

  return {
    id: order.id,
    email: order.email,
    total: order.total,
    createdAt: order.created_at,
    items,
  }
}
