// Re-export all types from individual modules
export * from './user'
export * from './product'
export * from './cart'

// Common types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  page?: string
  limit?: string
  search?: string
  category?: string
  sort?: string
  order?: 'asc' | 'desc'
  minPrice?: string
  maxPrice?: string
}

export interface FilterOptions {
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  brands: string[]
  inStock?: boolean
}