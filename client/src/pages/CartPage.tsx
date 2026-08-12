import { Link } from 'react-router-dom'
import { useCart } from '../cart/useCart'
import { formatPrice } from '../types'

export function CartPage() {
  const { items, total, setQty, remove } = useCart()

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
          <p className="lede">El checkout se conecta el día 4.</p>
        </>
      )}
    </main>
  )
}
