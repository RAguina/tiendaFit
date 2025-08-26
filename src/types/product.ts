export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  cost?: number
  sku: string
  barcode?: string
  trackQuantity: boolean
  quantity: number
  images: ProductImage[]
  category: Category
  categoryId: string
  brand?: Brand
  brandId?: string
  variants: ProductVariant[]
  tags: string[]
  status: ProductStatus
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  weight?: number
  dimensions?: ProductDimensions
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt?: string
  position: number
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  value: string
  price?: number
  sku?: string
  barcode?: string
  quantity?: number
  image?: string
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
}

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

export interface ProductCreateData {
  name: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  cost?: number
  sku: string
  barcode?: string
  trackQuantity: boolean
  quantity: number
  categoryId: string
  brandId?: string
  tags: string[]
  status: ProductStatus
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  weight?: number
  dimensions?: ProductDimensions
  images: { url: string; alt?: string }[]
  variants?: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>[]
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  id: string
}

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  tags?: string[]
  search?: string
}