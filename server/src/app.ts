import cors from 'cors'
import express from 'express'
import ordersRouter from './routes/orders.js'
import productsRouter from './routes/products.js'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'orilla-api',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})
