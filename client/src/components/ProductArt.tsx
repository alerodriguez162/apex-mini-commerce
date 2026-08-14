import type { CSSProperties } from 'react'
import type { Product } from '../types'

const SHAPES: Record<string, string> = {
  'camisa-lino-marea': 'shirt',
  'poncho-salitre': 'poncho',
  'short-espuma': 'shorts',
  'sandalia-arrecife': 'sandal',
  'alpargata-duna': 'flat',
  'bolsa-yute': 'tote',
  'sombrero-palma': 'hat',
  'gorra-orilla': 'cap',
  'toalla-costa': 'towel',
  'chaqueta-viento': 'jacket',
}

export function ProductArt({
  product,
  className = '',
}: {
  product: Product
  className?: string
}) {
  const shape = SHAPES[product.slug] ?? 'shirt'

  return (
    <div
      className={`art ${className}`}
      style={{ '--hue': product.hue } as CSSProperties}
      aria-hidden="true"
    >
      <svg className="art-shape" viewBox="0 0 200 240">
        {shape === 'shirt' && (
          <path d="M40 58 L70 42 L85 62 L115 62 L130 42 L160 58 L148 82 L148 200 L52 200 L52 82 Z" />
        )}
        {shape === 'poncho' && (
          <path d="M28 70 L100 42 L172 70 L158 210 L42 210 Z M88 62 Q100 80 112 62" fillOpacity="0.95" />
        )}
        {shape === 'shorts' && (
          <path d="M58 70 H142 V118 L168 198 H118 L100 128 L82 198 H32 L58 118 Z" />
        )}
        {shape === 'sandal' && (
          <>
            <ellipse cx="100" cy="168" rx="62" ry="22" />
            <path d="M55 160 Q100 90 150 148" fill="none" stroke="currentColor" strokeWidth="10" />
          </>
        )}
        {shape === 'flat' && (
          <path d="M40 150 Q100 120 168 152 L160 172 Q100 156 44 170 Z" />
        )}
        {shape === 'tote' && (
          <>
            <rect x="62" y="78" width="76" height="122" />
            <path d="M78 78 Q78 48 100 48 Q122 48 122 78" fill="none" stroke="currentColor" strokeWidth="8" />
          </>
        )}
        {shape === 'hat' && (
          <>
            <ellipse cx="100" cy="150" rx="78" ry="16" />
            <path d="M62 148 Q100 48 138 148" />
          </>
        )}
        {shape === 'cap' && (
          <path d="M55 140 Q100 70 145 140 L175 148 L175 162 L48 162 L48 148 Z" />
        )}
        {shape === 'towel' && (
          <rect x="48" y="48" width="104" height="150" rx="4" />
        )}
        {shape === 'jacket' && (
          <path d="M38 70 L72 48 L86 70 L114 70 L128 48 L162 70 L152 92 V210 H48 V92 Z" />
        )}
      </svg>
    </div>
  )
}
