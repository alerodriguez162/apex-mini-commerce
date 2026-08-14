type Store = typeof import('./db-memory.js')

const store: Store = process.env.VERCEL
  ? await import('./db-memory.js')
  : await import('./db-sqlite.js')

export const listProducts = store.listProducts
export const getProductBySlug = store.getProductBySlug
export const getProductById = store.getProductById
export const createOrder = store.createOrder
export const getOrderById = store.getOrderById
