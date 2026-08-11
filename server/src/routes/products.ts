import { Router } from 'express'
import { getProductBySlug, listProducts } from '../db.js'
import { CATEGORIES, type ProductCategory } from '../types.js'

const router = Router()

function isCategory(value: unknown): value is ProductCategory {
  return typeof value === 'string' && CATEGORIES.includes(value as ProductCategory)
}

router.get('/', (req, res) => {
  const { category } = req.query
  if (category !== undefined && !isCategory(category)) {
    res.status(400).json({ error: 'Invalid category' })
    return
  }
  res.json(listProducts({ category }))
})

router.get('/:slug', (req, res) => {
  const product = getProductBySlug(req.params.slug)
  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(product)
})

export default router
