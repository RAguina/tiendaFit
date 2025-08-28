import { useUserData } from "@/hooks/use-user-data"
import { useRouter } from "next/navigation"
import { getStatusColor, getStatusText, formatDate } from "@/lib/mock-data"
import { useCurrency } from "@/contexts/currency-context"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    name: string
    image: string
  }
}

interface Address {
  id: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

interface Order {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
  address: Address
}

export default function OrdersSection() {
  const { loading: userLoading } = useUserData()
  const { formatPrice } = useCurrency()
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return

      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [session])

  const recentOrders = orders

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Pedidos
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Pedidos
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Ver Todos
          </button>
        </div>
      </div>
      <div className="p-6">
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices tu primera compra, aparecerá aquí con toda la información de seguimiento.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Pedido realizado el {formatDate(order.createdAt)}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.items.length} artículo{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                </div>

                {selectedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Details */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Detalles del Pedido</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Envío:</span>
                            <span>{formatPrice(order.shipping)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Impuestos:</span>
                            <span>{formatPrice(order.tax)}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Dirección de Envío</h5>
                        <div className="text-sm text-gray-600">
                          <p>{order.address.firstName} {order.address.lastName}</p>
                          <p>{order.address.address1}</p>
                          {order.address.address2 && <p>{order.address.address2}</p>}
                          <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                          <p>{order.address.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-3">Artículos</h5>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              {item.product.image ? (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{item.product.name}</h6>
                              <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-500">{formatPrice(item.price)} c/u</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => router.push(`/orders/${order.id}/confirmation`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ver Detalles
                      </button>
                      {order.status === 'DELIVERED' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Recomprar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}