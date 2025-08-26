import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(999, 'Quantity cannot exceed 999'),
})

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(999, 'Quantity cannot exceed 999'),
})

export const removeFromCartSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
})

export const applyCouponSchema = z.object({
  code: z
    .string()
    .min(1, 'Coupon code is required')
    .max(50, 'Coupon code must be less than 50 characters')
    .transform((val) => val.toUpperCase()),
})

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(1, 'Coupon code is required')
      .max(50, 'Coupon code must be less than 50 characters')
      .regex(
        /^[A-Z0-9-_]+$/,
        'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores'
      )
      .transform((val) => val.toUpperCase()),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
    value: z
      .number()
      .min(0, 'Value must be greater than or equal to 0'),
    minOrderAmount: z
      .number()
      .min(0, 'Minimum order amount must be greater than or equal to 0')
      .optional(),
    maxDiscount: z
      .number()
      .min(0, 'Maximum discount must be greater than or equal to 0')
      .optional(),
    usageLimit: z
      .number()
      .min(1, 'Usage limit must be at least 1')
      .optional(),
    validFrom: z.string().datetime('Please enter a valid date'),
    validTo: z.string().datetime('Please enter a valid date'),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => new Date(data.validFrom) < new Date(data.validTo),
    {
      message: 'Valid from date must be before valid to date',
      path: ['validTo'],
    }
  )
  .refine(
    (data) => data.type !== 'PERCENTAGE' || data.value <= 100,
    {
      message: 'Percentage value cannot exceed 100',
      path: ['value'],
    }
  );


export const shippingAddressSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(200, 'Street address must be less than 200 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),
  zipCode: z
    .string()
    .min(1, 'Zip code is required')
    .max(20, 'Zip code must be less than 20 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s-()]+$/.test(val),
      'Please enter a valid phone number'
    ),
})

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  useSameAddress: z.boolean().default(true),
  shippingOptionId: z.string().min(1, 'Please select a shipping option'),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
  couponCode: z.string().optional(),
  saveAddress: z.boolean().default(false),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
  marketingEmails: z.boolean().default(false),
})

export const orderStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z
    .string()
    .max(500, 'Note must be less than 500 characters')
    .optional(),
  trackingNumber: z
    .string()
    .max(100, 'Tracking number must be less than 100 characters')
    .optional(),
})

export const orderFiltersSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  customerId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'updatedAt', 'total']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>
export type CreateCouponInput = z.infer<typeof createCouponSchema>
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
export type OrderFiltersInput = z.infer<typeof orderFiltersSchema>