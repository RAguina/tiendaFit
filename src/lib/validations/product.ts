import { z } from 'zod'

export const productImageSchema = z.object({
  url: z.string().url('Please enter a valid image URL'),
  alt: z.string().optional(),
})

export const productVariantSchema = z.object({
  name: z
    .string()
    .min(1, 'Variant name is required')
    .max(50, 'Variant name must be less than 50 characters'),
  value: z
    .string()
    .min(1, 'Variant value is required')
    .max(50, 'Variant value must be less than 50 characters'),
  price: z
    .number()
    .min(0, 'Price must be greater than or equal to 0')
    .optional(),
  sku: z
    .string()
    .max(50, 'SKU must be less than 50 characters')
    .optional(),
  barcode: z
    .string()
    .max(50, 'Barcode must be less than 50 characters')
    .optional(),
  quantity: z
    .number()
    .min(0, 'Quantity must be greater than or equal to 0')
    .optional(),
  image: z.string().url('Please enter a valid image URL').optional(),
  position: z.number().min(0, 'Position must be greater than or equal to 0'),
})

export const productDimensionsSchema = z.object({
  length: z.number().min(0, 'Length must be greater than or equal to 0'),
  width: z.number().min(0, 'Width must be greater than or equal to 0'),
  height: z.number().min(0, 'Height must be greater than or equal to 0'),
  unit: z.enum(['cm', 'in']),
})

/** Base object schema (sin efectos) para permitir .partial() y .extend() en update */
const createProductBaseSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Product description is required')
    .max(5000, 'Product description must be less than 5000 characters'),
  shortDescription: z
    .string()
    .max(500, 'Short description must be less than 500 characters')
    .optional(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  compareAtPrice: z
    .number()
    .min(0, 'Compare at price must be greater than or equal to 0')
    .optional(),
  cost: z.number().min(0, 'Cost must be greater than or equal to 0').optional(),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be less than 50 characters'),
  barcode: z.string().max(50, 'Barcode must be less than 50 characters').optional(),
  trackQuantity: z.boolean().default(true),
  quantity: z.number().min(0, 'Quantity must be greater than or equal to 0'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  weight: z.number().min(0, 'Weight must be greater than or equal to 0').optional(),
  dimensions: productDimensionsSchema.optional(),
  images: z
    .array(productImageSchema)
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  variants: z.array(productVariantSchema).max(50, 'Maximum 50 variants allowed').optional(),
})

/** Create: aplica la regla compareAtPrice > price a nivel objeto */
export const createProductSchema = createProductBaseSchema.refine(
  (data) => data.compareAtPrice === undefined || data.compareAtPrice > data.price,
  {
    message: 'Compare at price must be greater than the regular price',
    path: ['compareAtPrice'],
  }
)

/** Update: todos los campos del base son opcionales + id requerido */
export const updateProductSchema = createProductBaseSchema
  .partial()
  .extend({
    id: z.string().min(1, 'Product ID is required'),
  })

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  image: z.string().url('Please enter a valid image URL').optional(),
  parentId: z.string().optional(),
})

export const brandSchema = z.object({
  name: z
    .string()
    .min(1, 'Brand name is required')
    .max(100, 'Brand name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  logo: z.string().url('Please enter a valid logo URL').optional(),
  website: z.string().url('Please enter a valid website URL').optional(),
})

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sort: z.enum(['name', 'price', 'createdAt', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const bulkUpdateProductsSchema = z.object({
  productIds: z.array(z.string()).min(1, 'At least one product must be selected'),
  updates: z.object({
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
    featured: z.boolean().optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BrandInput = z.infer<typeof brandSchema>
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>
export type BulkUpdateProductsInput = z.infer<typeof bulkUpdateProductsSchema>
export type ProductImageInput = z.infer<typeof productImageSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
export type ProductDimensionsInput = z.infer<typeof productDimensionsSchema>
