import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string
  service: string
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<HealthResponse>
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <div className="page">
      <header className="hero">
        <p className="brand">Orilla</p>
        <h1>Ropa de costa, hecha para el viento.</h1>
        <p className="lede">
          Mini e-commerce · Apex Bench semana 2. Día 1: scaffold, API health y
          shell del storefront.
        </p>
        <a className="cta" href="#estado">
          Ver estado
        </a>
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

      <section id="estado" className="status" aria-live="polite">
        <h2>API</h2>
        {error && <p className="error">Offline — {error}</p>}
        {health && (
          <p className="ok">
            {health.service} · {health.status}
          </p>
        )}
        {!health && !error && <p>Comprobando…</p>}
      </section>
    </div>
  )
}

export default App
