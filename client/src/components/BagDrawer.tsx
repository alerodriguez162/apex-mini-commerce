import { Link } from 'react-router-dom'
import { useCart } from '../cart/useCart'
import { useUi } from '../ui/UiContext'
import { formatPrice } from '../types'
import { ProductArt } from './ProductArt'

export function BagDrawer() {
  const { items, total, setQty, remove } = useCart()
  const { bagOpen, closeBag } = useUi()

  if (!bagOpen) return null

  return (
    <div className="drawer-root">
      <button type="button" className="drawer-scrim" aria-label="Cerrar bolsa" onClick={closeBag} />
      <aside className="drawer" role="dialog" aria-label="Bolsa">
        <header className="drawer-head">
          <h2>Bolsa</h2>
          <button type="button" className="linkish" onClick={closeBag}>
            Cerrar
          </button>
        </header>
        {items.length === 0 ? (
          <p className="empty">Aún no hay piezas.</p>
        ) : (
          <ul className="drawer-list">
            {items.map((item) => (
              <li key={item.product.id} className="drawer-row">
                <ProductArt product={item.product} className="art-mini" />
                <div>
                  <h3>{item.product.name}</h3>
                  <p>{formatPrice(item.product.price)}</p>
                  <div className="qty-row">
                    <button type="button" onClick={() => setQty(item.product.id, item.qty - 1)}>
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => setQty(item.product.id, item.qty + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button type="button" className="linkish" onClick={() => remove(item.product.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
        <footer className="drawer-foot">
          <p className="total">Total {formatPrice(total)}</p>
          <Link className="cta-btn" to="/bolsa" onClick={closeBag}>
            Ir a pagar
          </Link>
        </footer>
      </aside>
    </div>
  )
}
