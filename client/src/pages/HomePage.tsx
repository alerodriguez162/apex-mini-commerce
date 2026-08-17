import { Link } from 'react-router-dom'
import { ProductTile } from '../components/ProductTile'
import { SeenRail } from '../components/SeenRail'
import { useProducts } from '../hooks/useProducts'

const TICKER = ['Lino lavado', 'Yute', 'Salitre', 'Corte amplio', 'Hecho lento', 'Costa']

export function HomePage() {
  const { products } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <>
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Nueva marea · 26</p>
          <p className="brand">Orilla</p>
          <h1>Ropa de costa, hecha para el viento.</h1>
          <p className="lede">Lino, yute y sal. Piezas lentas para días junto al mar.</p>
          <div className="hero-actions">
            <Link className="cta-btn" to="/tienda">
              Entrar a la tienda
            </Link>
            <Link className="ghost-btn" to="/tienda?cat=ropa">
              Ver ropa
            </Link>
          </div>
        </div>
        <div className="hero-stage">
          {featured.slice(0, 3).map((product, index) => (
            <div key={product.id} className={`hero-card hero-card-${index + 1}`}>
              <ProductTile product={product} compact />
            </div>
          ))}
        </div>
      </header>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((word, i) => (
            <span key={`${word}-${i}`}>{word}</span>
          ))}
        </div>
      </div>

      <section className="home-block">
        <header className="block-head">
          <div>
            <p className="eyebrow">Selección</p>
            <h2>Colección marea</h2>
          </div>
          <Link className="text-link" to="/tienda">
            Ver todo
          </Link>
        </header>
        <div className="grid grid-home">
          {featured.map((product, index) => (
            <ProductTile key={product.id} product={product} featured={index === 0} />
          ))}
        </div>
      </section>

      <section className="home-cats">
        <Link to="/tienda?cat=ropa">
          <span>01</span>
          Ropa
        </Link>
        <Link to="/tienda?cat=calzado">
          <span>02</span>
          Calzado
        </Link>
        <Link to="/tienda?cat=accesorios">
          <span>03</span>
          Accesorios
        </Link>
      </section>
      <SeenRail />
    </>
  )
}
