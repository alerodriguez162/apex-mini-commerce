export type ProductCategory = 'ropa' | 'calzado' | 'accesorios'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  category: ProductCategory
  hue: string
  stock: number
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ropa: 'Ropa',
  calzado: 'Calzado',
  accesorios: 'Accesorios',
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(cents)
}
