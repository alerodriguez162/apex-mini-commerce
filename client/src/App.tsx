import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { UiProvider } from './ui/UiContext'
import { WishlistProvider } from './wishlist/WishlistContext'
import './App.css'

const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })),
)
const ProductPage = lazy(() =>
  import('./pages/ProductPage').then((m) => ({ default: m.ProductPage })),
)
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })))
const OrderPage = lazy(() => import('./pages/OrderPage').then((m) => ({ default: m.OrderPage })))
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })),
)

export default function App() {
  return (
    <ErrorBoundary>
      <UiProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <Suspense fallback={<p className="empty" style={{ padding: '2rem 1.5rem' }}>Cargando…</p>}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="tienda" element={<CatalogPage />} />
                    <Route path="tienda/:slug" element={<ProductPage />} />
                    <Route path="bolsa" element={<CartPage />} />
                    <Route path="deseos" element={<WishlistPage />} />
                    <Route path="pedido/:id" element={<OrderPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </UiProvider>
    </ErrorBoundary>
  )
}
