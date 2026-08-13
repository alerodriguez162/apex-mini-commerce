import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import { Layout } from './components/Layout'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { OrderPage } from './pages/OrderPage'
import { ProductPage } from './pages/ProductPage'
import './App.css'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tienda" element={<CatalogPage />} />
            <Route path="tienda/:slug" element={<ProductPage />} />
            <Route path="bolsa" element={<CartPage />} />
            <Route path="pedido/:id" element={<OrderPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
