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

export const CATEGORIES: ProductCategory[] = ['ropa', 'calzado', 'accesorios']
