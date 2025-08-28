// Mock data for development and testing

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  total: number
  subtotal: number
  shipping: number
  tax: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    country: string
  }
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'TF-2024-0001',
    status: 'DELIVERED',
    total: 149.99,
    subtotal: 129.99,
    shipping: 15.00,
    tax: 5.00,
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    estimatedDelivery: '2024-02-20',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        productName: 'Proteína Whey Premium 2kg',
        quantity: 1,
        price: 89.99,
        image: '/images/protein-whey.jpg'
      },
      {
        id: '2',
        productName: 'Creatina Monohidrato 300g',
        quantity: 2,
        price: 20.00,
        image: '/images/creatine.jpg'
      }
    ],
    shippingAddress: {
      name: 'Juan Pérez',
      address: 'Av. Corrientes 1234, Apt 5B',
      city: 'Buenos Aires',
      state: 'CABA',
      country: 'Argentina'
    }
  },
  {
    id: '2',
    orderNumber: 'TF-2024-0002',
    status: 'SHIPPED',
    total: 89.50,
    subtotal: 74.50,
    shipping: 10.00,
    tax: 5.00,
    createdAt: '2024-02-25T16:45:00Z',
    updatedAt: '2024-02-26T09:15:00Z',
    estimatedDelivery: '2024-02-28',
    trackingNumber: 'TRK987654321',
    items: [
      {
        id: '3',
        productName: 'Pre-Entreno Energy Boost',
        quantity: 1,
        price: 45.00,
        image: '/images/pre-workout.jpg'
      },
      {
        id: '4',
        productName: 'Aminoácidos BCAA',
        quantity: 1,
        price: 29.50,
        image: '/images/bcaa.jpg'
      }
    ],
    shippingAddress: {
      name: 'Juan Pérez',
      address: 'Av. Corrientes 1234, Apt 5B',
      city: 'Buenos Aires',
      state: 'CABA',
      country: 'Argentina'
    }
  },
  {
    id: '3',
    orderNumber: 'TF-2024-0003',
    status: 'PROCESSING',
    total: 199.99,
    subtotal: 179.99,
    shipping: 15.00,
    tax: 5.00,
    createdAt: '2024-02-28T12:20:00Z',
    updatedAt: '2024-02-28T15:30:00Z',
    estimatedDelivery: '2024-03-05',
    items: [
      {
        id: '5',
        productName: 'Kit Completo Suplementos',
        quantity: 1,
        price: 179.99,
        image: '/images/supplement-kit.jpg'
      }
    ],
    shippingAddress: {
      name: 'Juan Pérez',
      address: 'Av. Corrientes 1234, Apt 5B',
      city: 'Buenos Aires',
      state: 'CABA',
      country: 'Argentina'
    }
  },
  {
    id: '4',
    orderNumber: 'TF-2024-0004',
    status: 'PENDING',
    total: 65.00,
    subtotal: 55.00,
    shipping: 5.00,
    tax: 5.00,
    createdAt: '2024-03-01T09:10:00Z',
    updatedAt: '2024-03-01T09:10:00Z',
    estimatedDelivery: '2024-03-07',
    items: [
      {
        id: '6',
        productName: 'Barra Proteica x12 unidades',
        quantity: 1,
        price: 35.00,
        image: '/images/protein-bars.jpg'
      },
      {
        id: '7',
        productName: 'Shaker Premium',
        quantity: 1,
        price: 20.00,
        image: '/images/shaker.jpg'
      }
    ],
    shippingAddress: {
      name: 'Juan Pérez',
      address: 'Av. Corrientes 1234, Apt 5B',
      city: 'Buenos Aires',
      state: 'CABA',
      country: 'Argentina'
    }
  }
]

export const getStatusColor = (status: Order['status']) => {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'CONFIRMED': 'bg-blue-100 text-blue-800',
    'PROCESSING': 'bg-purple-100 text-purple-800',
    'SHIPPED': 'bg-indigo-100 text-indigo-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'REFUNDED': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || colors.PENDING
}

export const getStatusText = (status: Order['status']) => {
  const statusTexts = {
    'PENDING': 'Pendiente',
    'CONFIRMED': 'Confirmado',
    'PROCESSING': 'Procesando',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado',
    'REFUNDED': 'Reembolsado'
  }
  return statusTexts[status] || statusTexts.PENDING
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}