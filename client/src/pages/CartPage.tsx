import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api'
import { useCart } from '../cart/useCart'
import { EmptyState } from '../components/EmptyState'
import { ProductArt } from '../components/ProductArt'
import { formatPrice } from '../types'

const COUPON = 'ORILLA10'
const DISCOUNT = 0.1

export function CartPage() {
  const { items, total, setQty, remove, clear } = useCart()
  const [email, setEmail] = useState('')
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const discount = applied ? Math.round(total * DISCOUNT) : 0
  const payable = total - discount

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === COUPON) {
      setApplied(true)
      setError(null)
    } else {
      setApplied(false)
      setError('Cupón no válido. Prueba ORILLA10.')
    }
  }

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
        <EmptyState
          title="La bolsa está en calma"
          copy="Aún no hay piezas. El viento trae lino, yute y sal."
        />
      ) : (
        <div className="cart-layout">
          <ul>
            {items.map((item) => (
              <li key={item.product.id} className="cart-row">
                <ProductArt product={item.product} className="art-mini" />
                <div>
                  <h2>{item.product.name}</h2>
                  <p>{formatPrice(item.product.price)}</p>
                </div>
                <div className="qty-row">
                  <button type="button" onClick={() => setQty(item.product.id, item.qty - 1)}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => setQty(item.product.id, item.qty + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="linkish" onClick={() => remove(item.product.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <form className="checkout" onSubmit={handleCheckout}>
            <p className="total">Subtotal {formatPrice(total)}</p>
            {applied && (
              <p className="stock">
                Cupón {COUPON}: −{formatPrice(discount)}
              </p>
            )}
            <p className="total">A pagar {formatPrice(payable)}</p>
            <label>
              Cupón
              <div className="coupon-row">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="ORILLA10"
                />
                <button type="button" className="ghost-btn" onClick={applyCoupon}>
                  Aplicar
                </button>
              </div>
            </label>
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
        </div>
      )}
    </main>
  )
}
