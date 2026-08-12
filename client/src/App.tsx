import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import { Layout } from './components/Layout'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
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
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
