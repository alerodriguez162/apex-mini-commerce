import { Link } from 'react-router-dom'
import { ProductTile } from '../components/ProductTile'
import { useProducts } from '../hooks/useProducts'

export function HomePage() {
  const { products } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <>
      <header className="hero">
        <p className="brand">Orilla</p>
        <h1>Ropa de costa, hecha para el viento.</h1>
        <p className="lede">Lino, yute y sal. Piezas lentas para días junto al mar.</p>
        <Link className="cta" to="/tienda">
          Entrar a la tienda
        </Link>
        <svg className="shore" viewBox="0 0 1200 280" aria-hidden="true">
          <path
            d="M0 180 C 180 90, 320 240, 520 150 C 720 60, 880 210, 1200 110 L 1200 280 L 0 280 Z"
            fill="#2a5c4c"
          />
          <path
            d="M0 210 C 220 140, 400 250, 640 180 C 880 110, 1040 230, 1200 160 L 1200 280 L 0 280 Z"
            fill="#17302b"
          />
        </svg>
      </header>

      <section className="home-block">
        <header className="block-head">
          <h2>Colección marea</h2>
          <Link to="/tienda">Ver todo</Link>
        </header>
        <div className="grid grid-home">
          {featured.map((product, index) => (
            <ProductTile key={product.id} product={product} featured={index === 0} />
          ))}
        </div>
      </section>

      <section className="home-cats">
        <Link to="/tienda?cat=ropa">Ropa</Link>
        <Link to="/tienda?cat=calzado">Calzado</Link>
        <Link to="/tienda?cat=accesorios">Accesorios</Link>
      </section>
    </>
  )
}
