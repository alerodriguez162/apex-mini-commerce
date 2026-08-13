import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../api'
import { useCart } from '../cart/useCart'
import { formatPrice } from '../types'

export function CartPage() {
  const { items, total, setQty, remove, clear } = useCart()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleCheckout(event: FormEvent) {
    event.preventDefault()
    if (!email.includes('@') || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const order = await createOrder({
        email,
        items: items.map((item) => ({ productId: item.product.id, qty: item.qty })),
      })
      clear()
      navigate(`/pedido/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al pagar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="cart">
      <h1>Bolsa</h1>
      {items.length === 0 ? (
        <p className="empty">
          Vacía. <Link to="/tienda">Ir a la tienda</Link>
        </p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.product.id} className="cart-row">
                <span className="swatch" style={{ background: item.product.hue }} />
                <div>
                  <h2>{item.product.name}</h2>
                  <p>{formatPrice(item.product.price)}</p>
                </div>
                <label>
                  Cant.
                  <input
                    type="number"
                    min={1}
                    max={item.product.stock}
                    value={item.qty}
                    onChange={(e) => setQty(item.product.id, Number(e.target.value))}
                  />
                </label>
                <button type="button" className="linkish" onClick={() => remove(item.product.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <p className="total">Total {formatPrice(total)}</p>
          <form className="checkout" onSubmit={handleCheckout}>
            <label>
              Correo para el pedido
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="cta-btn" type="submit" disabled={submitting}>
              {submitting ? 'Enviando…' : 'Confirmar pedido'}
            </button>
          </form>
        </>
      )}
    </main>
  )
}
