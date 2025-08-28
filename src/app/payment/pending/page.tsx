'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Link from 'next/link'

export default function PaymentPendingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  
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

  if (status === 'loading') {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            Pago Pendiente
          </h1>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tu pago está siendo procesado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Estamos esperando la confirmación del pago. Esto puede tomar unos minutos.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ¿Qué pasa ahora?
            </h3>
            <div className="text-left space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">🔄</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Procesamiento automático</p>
                  <p className="text-sm">El pago se confirmará automáticamente una vez procesado</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">📧</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notificación por email</p>
                  <p className="text-sm">Te enviaremos un email cuando se confirme el pago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">👀</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Seguimiento en tiempo real</p>
                  <p className="text-sm">Puedes verificar el estado en tu historial de órdenes</p>
                </div>
              </div>
            </div>
          </div>

          {orderId && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Número de Orden:</p>
              <p className="font-mono text-primary-600 dark:text-primary-400">
                #{orderId.slice(-8).toUpperCase()}
              </p>
              {paymentId && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ID de Pago:</p>
                  <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {paymentId}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">💡 Métodos de pago que pueden requerir tiempo adicional:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Transferencias bancarias</li>
              <li>• Pagos en efectivo (Rapipago, Pago Fácil)</li>
              <li>• Algunos bancos pueden requerir verificación adicional</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link 
              href={orderId ? `/orders/${orderId}/confirmation` : '/account?tab=orders'}
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Ver Estado de la Orden
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