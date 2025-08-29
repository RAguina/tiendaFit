'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'

function PaymentFailureContent() {
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
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Pago No Completado
          </h1>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se pudo procesar tu pago
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              El pago fue cancelado o no se completó correctamente. 
              No te preocupes, tu carrito se mantiene guardado para que puedas intentar nuevamente.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ¿Qué puedes hacer?
            </h3>
            <div className="text-left space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">🔄</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Intentar nuevamente</p>
                  <p className="text-sm">Puedes volver a intentar el pago desde tu historial de órdenes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">💳</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Verificar tu método de pago</p>
                  <p className="text-sm">Asegúrate de que tu tarjeta tenga fondos suficientes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">📞</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Contactar soporte</p>
                  <p className="text-sm">Si el problema persiste, contáctanos para ayudarte</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-blue-500 mr-3 text-xl">🛒</div>
              <div>
                <h4 className="text-blue-900 dark:text-blue-100 font-medium mb-1">
                  Tu carrito está seguro
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Todos los productos que seleccionaste siguen en tu carrito. 
                  Puedes continuar desde donde lo dejaste.
                </p>
              </div>
            </div>
          </div>

          {orderId && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Número de Orden:</p>
              <p className="font-mono text-primary-600 dark:text-primary-400">
                #{orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link 
              href="/checkout"
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              🔄 Intentar Pago Nuevamente
            </Link>
            
            <div className="flex gap-4">
              <Link 
                href="/cart"
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                🛒 Ver Carrito
              </Link>
              <Link 
                href="/products"
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                🛍️ Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  )
}