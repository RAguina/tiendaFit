export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'ADMIN' | 'USER'

export interface UserProfile extends User {
  phone?: string
  dateOfBirth?: Date
  addresses: Address[]
  orders: Order[]
}

export interface Address {
  id: string
  userId: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  total: number
  subtotal: number
  tax: number
  shipping: number
  items: OrderItem[]
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod: PaymentMethod
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number
  product: {
    name: string
    image: string
    slug: string
  }
  variant?: {
    name: string
    value: string
  }
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED'

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}