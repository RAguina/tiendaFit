'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tu carrito esta vacio
          </h1>
          <Link 
            href="/products"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Carrito de Compras
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.category}</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  ${item.price}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  -
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-600 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mb-4">
              <span>Total: ${getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
              Proceder al Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}