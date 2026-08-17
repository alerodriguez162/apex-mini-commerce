import { Link } from 'react-router-dom'

export function EmptyState({
  title,
  copy,
  to = '/tienda',
  action = 'Ir a la tienda',
}: {
  title: string
  copy: string
  to?: string
  action?: string
}) {
  return (
    <div className="empty-card">
      <svg viewBox="0 0 200 120" className="empty-art" aria-hidden="true">
        <path d="M0 88 C 40 60, 80 110, 120 78 C 150 56, 175 90, 200 70 L 200 120 L 0 120 Z" />
        <circle cx="156" cy="28" r="10" />
      </svg>
      <h2>{title}</h2>
      <p>{copy}</p>
      <Link className="cta-btn" to={to}>
        {action}
      </Link>
    </div>
  )
}
