import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../cart/useCart'

export function Layout() {
  const { count } = useCart()

  return (
    <div className="page">
      <nav className="nav">
        <Link className="nav-brand" to="/">
          Orilla
        </Link>
        <div className="nav-links">
          <Link to="/tienda">Tienda</Link>
          <Link to="/bolsa">
            Bolsa{count > 0 ? <span className="bag-count">{count}</span> : null}
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
