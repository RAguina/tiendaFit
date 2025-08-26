export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number
  product: {
    id: string
    name: string
    slug: string
    image: string
    price: number
    compareAtPrice?: number
    sku: string
    trackQuantity: boolean
    quantity: number
    status: string
  }
  variant?: {
    id: string
    name: string
    value: string
    price?: number
    sku?: string
    quantity?: number
  }
  addedAt: Date
  updatedAt: Date
}

export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  discount: number
  couponCode?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartSummary {
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
}

export interface AddToCartData {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemData {
  itemId: string
  quantity: number
}

export interface RemoveFromCartData {
  itemId: string
}

export interface ApplyCouponData {
  code: string
}

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom: Date
  validTo: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'

export interface ShippingOption {
  id: string
  name: string
  description?: string
  price: number
  estimatedDays: number
  isActive: boolean
}

export interface CheckoutData {
  items: CartItem[]
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  billingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  shippingOption: ShippingOption
  paymentMethod: string
  couponCode?: string
}