import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../cart/useCart'
import { useUi } from '../ui/UiContext'
import { useWishlist } from '../wishlist/WishlistContext'
import { BagDrawer } from './BagDrawer'

export function Layout() {
  const { count } = useCart()
  const { ids } = useWishlist()
  const { openBag, toast } = useUi()

  return (
    <div className="page">
      <nav className="nav">
        <Link className="nav-brand" to="/">
          Orilla
        </Link>
        <div className="nav-links">
          <NavLink to="/tienda">Tienda</NavLink>
          <NavLink to="/deseos">
            Deseos{ids.length > 0 ? <span className="bag-count">{ids.length}</span> : null}
          </NavLink>
          <button type="button" className="nav-bag" onClick={openBag}>
            Bolsa{count > 0 ? <span className="bag-count">{count}</span> : null}
          </button>
        </div>
      </nav>
      <Outlet />
      <footer className="site-foot">
        <p>Orilla · costa lenta · Apex Bench W2</p>
        <p>Hecho para el viento, no para la prisa.</p>
      </footer>
      <BagDrawer />
      {toast && <div className="toast">{toast.message}</div>}
    </div>
  )
}
