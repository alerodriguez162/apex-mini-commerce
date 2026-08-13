import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchOrder } from '../api'
import { formatPrice } from '../types'

export function OrderPage() {
  const { id = '' } = useParams()
  const [order, setOrder] = useState<Awaited<ReturnType<typeof fetchOrder>> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrder(id).then(setOrder).catch((err: Error) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <main className="cart">
        <p className="error">{error}</p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="cart">
        <p className="empty">Cargando pedido…</p>
      </main>
    )
  }

  return (
    <main className="cart">
      <p className="eyebrow">Pedido listo</p>
      <h1>Gracias</h1>
      <p className="lede">
        Enviamos la confirmación a {order.email}. Total {formatPrice(order.total)}.
      </p>
      <ul>
        {order.items.map((item) => (
          <li key={item.name} className="cart-row">
            <div>
              <h2>{item.name}</h2>
              <p>
                {item.qty} × {formatPrice(item.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Link className="cta" to="/tienda">
        Seguir en la tienda
      </Link>
    </main>
  )
}
