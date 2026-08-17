import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../cart/useCart'
import { useUi } from '../ui/UiContext'
import { useWishlist } from '../wishlist/WishlistContext'
import { BagDrawer } from './BagDrawer'

export function Layout() {
  const { count } = useCart()
  const { ids } = useWishlist()
  const { openBag, toast, theme, toggleTheme } = useUi()

  return (
    <div className="page">
      <nav className="nav">
        <Link className="nav-brand" to="/">
          Orilla
        </Link>
        <div className="nav-links">
          <NavLink to="/tienda">Tienda</NavLink>
          <NavLink to="/deseos">
            Deseos
            {ids.length > 0 ? <span className="bag-count">{ids.length}</span> : null}
          </NavLink>
          <button type="button" className="nav-theme" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'dark' ? 'Sol' : 'Luna'}
          </button>
          <button type="button" className="nav-bag" onClick={openBag}>
            Bolsa
            {count > 0 ? <span className="pill">{count}</span> : null}
          </button>
        </div>
      </nav>
      <Outlet />
      <footer className="site-foot">
        <div>
          <p className="nav-brand">Orilla</p>
          <p>Hecho para el viento, no para la prisa.</p>
        </div>
        <div className="foot-links">
          <Link to="/tienda">Tienda</Link>
          <Link to="/deseos">Deseos</Link>
          <Link to="/bolsa">Bolsa</Link>
        </div>
        <p className="foot-note">Costa lenta · Apex Bench W2</p>
      </footer>
      <BagDrawer />
      {toast && <div className="toast">{toast.message}</div>}
    </div>
  )
}
