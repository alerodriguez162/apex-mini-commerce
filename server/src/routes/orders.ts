import { Router } from 'express'
import { createOrder, getOrderById } from '../db.js'

const router = Router()

router.post('/', (req, res) => {
  const { email, items } = req.body ?? {}
  if (typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email is required' })
    return
  }
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Order items are required' })
    return
  }

  try {
    const order = createOrder(
      email.trim(),
      items.map((item: { productId?: string; qty?: number }) => ({
        productId: String(item.productId ?? ''),
        qty: Number(item.qty),
      })),
    )
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Could not create order' })
  }
})

router.get('/:id', (req, res) => {
  const order = getOrderById(req.params.id)
  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }
  res.json(order)
})

export default router
