'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  status: string
  paymentStatus: string
  total: number
  items: Array<{
    product: {
      name: string
    }
    quantity: number
  }>
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  const orderId = searchParams?.get('order_id')
  const paymentId = searchParams?.get('payment_id')
  const collectionStatus = searchParams?.get('collection_status')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!session || !orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [session, orderId])

  if (status === 'loading' || loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Verificando el pago...</p>
        </div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            No se pudo identificar la orden
          </p>
          <Link 
            href="/products"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            ¡Pago Exitoso!
          </h1>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tu pago ha sido procesado correctamente
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Recibirás un email de confirmación con todos los detalles de tu compra.
            </p>
          </div>

          {order && (
            <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detalles de la Orden
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Número de Orden:</span>
                  <div className="font-mono text-primary-600 dark:text-primary-400">
                    #{order.id.slice(-8).toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Pagado:</span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Estado de Pago:</span>
                  <div className="font-medium text-green-600">
                    {order.paymentStatus === 'PAID' ? 'Pagado' : 'Procesando'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Productos:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} artículos
                  </div>
                </div>
              </div>
              
              {paymentId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">ID de Pago MercadoPago:</span>
                  <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {paymentId}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Link 
              href={order ? `/orders/${order.id}/confirmation` : '/account?tab=orders'}
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Ver Detalles de la Orden
            </Link>
            
            <div className="flex gap-4">
              <Link 
                href="/account?tab=orders"
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Mis Órdenes
              </Link>
              <Link 
                href="/products"
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}