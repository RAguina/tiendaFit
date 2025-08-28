'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/cart-context'
import { Address } from '@prisma/client'
import { sanitizeUserInput } from '@/lib/sanitize'

interface OrderSummary {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, clearCart, getTotalPrice } = useCart()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe')
  const [loading, setLoading] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  
  // Calcular resumen de orden
  const calculateOrderSummary = (): OrderSummary => {
    const subtotal = getTotalPrice()
    const tax = subtotal * 0.16 // 16% IVA
    const shipping = subtotal > 1000 ? 0 : 100 // Envío gratis para compras > $1000
    const total = subtotal + tax + shipping
    
    return { subtotal, tax, shipping, total }
  }
  
  const orderSummary = calculateOrderSummary()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }
  }, [session, status, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
      return
    }
  }, [items, router])

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!session) return
      
      try {
        const response = await fetch('/api/addresses')
        if (response.ok) {
          const data = await response.json()
          setAddresses(data)
          
          // Auto-select default address
          const defaultAddress = data.find((addr: Address) => addr.isDefault)
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id)
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      } finally {
        setLoadingAddresses(false)
      }
    }

    fetchAddresses()
  }, [session])

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAddressId) {
      alert('Por favor selecciona una dirección de envío')
      return
    }

    setLoading(true)
    
    try {
      // Sanitize all form data
      const orderData = {
        addressId: sanitizeUserInput(selectedAddressId),
        items: items.map(item => ({
          productId: sanitizeUserInput(item.id.toString()),
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: sanitizeUserInput(paymentMethod),
        ...orderSummary
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        router.push(`/orders/${order.id}/confirmation`)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al procesar la orden')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Error al procesar la orden')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking auth or fetching data
  if (status === 'loading' || loadingAddresses) {
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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Address Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Dirección de Envío
                </h2>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No tienes direcciones registradas
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/account?tab=addresses')}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                    >
                      Agregar Dirección
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {address.firstName} {address.lastName}
                              {address.isDefault && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 mt-1">
                              {address.address1}
                              {address.address2 && `, ${address.address2}`}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {address.city}, {address.state} {address.postalCode}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {address.country}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Método de Pago
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Tarjeta de Crédito/Débito
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Procesado de forma segura con Stripe
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Pago Contra Entrega
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Paga en efectivo al recibir tu pedido
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Resumen de Orden
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IVA (16%):</span>
                  <span className="text-gray-900 dark:text-white">${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                  <span className="text-gray-900 dark:text-white">
                    {orderSummary.shipping === 0 ? 'Gratis' : `$${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading || !selectedAddressId}
                onClick={handleSubmitOrder}
                className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Procesando...' : 'Realizar Pedido'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}