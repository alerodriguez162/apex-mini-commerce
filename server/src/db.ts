import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Product, ProductCategory } from './types.js'

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

const SEED: Product[] = [
  {
    id: 'p1',
    slug: 'camisa-lino-marea',
    name: 'Camisa de lino Marea',
    description: 'Lino lavado, corte amplio, se mueve con el viento de la orilla.',
    price: 1890,
    category: 'ropa',
    hue: '#7aa8a0',
    stock: 18,
  },
  {
    id: 'p2',
    slug: 'poncho-salitre',
    name: 'Poncho Salitre',
    description: 'Tejido abierto, para atardeceres que se enfrían de golpe.',
    price: 2450,
    category: 'ropa',
    hue: '#c4a574',
    stock: 9,
  },
  {
    id: 'p3',
    slug: 'short-espuma',
    name: 'Short Espuma',
    description: 'Secado rápido, bolsillo profundo, para caminar la rompiente.',
    price: 980,
    category: 'ropa',
    hue: '#3d5c6e',
    stock: 24,
  },
  {
    id: 'p4',
    slug: 'sandalia-arrecife',
    name: 'Sandalia Arrecife',
    description: 'Suela flexible y tira de cuero vegetal. Pies en la arena.',
    price: 1320,
    category: 'calzado',
    hue: '#8b6b4a',
    stock: 14,
  },
  {
    id: 'p5',
    slug: 'alpargata-duna',
    name: 'Alpargata Duna',
    description: 'Yute y lona. Ligera como si no llevaras nada.',
    price: 890,
    category: 'calzado',
    hue: '#d4c4a8',
    stock: 20,
  },
  {
    id: 'p6',
    slug: 'bolsa-yute',
    name: 'Bolsa de yute Bruma',
    description: 'Capacidad para toalla, libro y una pieza de fruta.',
    price: 640,
    category: 'accesorios',
    hue: '#b9a078',
    stock: 30,
  },
  {
    id: 'p7',
    slug: 'sombrero-palma',
    name: 'Sombrero de palma',
    description: 'Ala ancha, trenza a mano. Sombra nítida al mediodía.',
    price: 760,
    category: 'accesorios',
    hue: '#e2d2a8',
    stock: 11,
  },
  {
    id: 'p8',
    slug: 'gorra-orilla',
    name: 'Gorra Orilla',
    description: 'Algodón pesado, bordado bajo. Para el camino de regreso.',
    price: 420,
    category: 'accesorios',
    hue: '#17302b',
    stock: 40,
  },
  {
    id: 'p9',
    slug: 'toalla-costa',
    name: 'Toalla Costa',
    description: 'Algodón grueso, raya única. Se tiende y ya es paisaje.',
    price: 780,
    category: 'accesorios',
    hue: '#6a9bb8',
    stock: 16,
  },
  {
    id: 'p10',
    slug: 'chaqueta-viento',
    name: 'Chaqueta Viento',
    description: 'Corta vientos salados. Se guarda en su propio bolsillo.',
    price: 2680,
    category: 'ropa',
    hue: '#2f4a58',
    stock: 7,
  },
]

const count = db.prepare('SELECT COUNT(*) as n FROM products').get() as { n: number }
if (count.n === 0) {
  const insert = db.prepare(
    `INSERT INTO products (id, slug, name, description, price, category, hue, stock)
     VALUES (@id, @slug, @name, @description, @price, @category, @hue, @stock)`,
  )
  const tx = db.transaction((rows: Product[]) => {
    for (const row of rows) insert.run(row)
  })
  tx(SEED)
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
