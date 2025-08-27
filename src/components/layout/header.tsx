'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/theme-context'
import { useCart } from '@/contexts/cart-context'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { theme, toggleTheme, isLoading } = useTheme()
  const { getTotalItems } = useCart()
  const { data: session } = useSession()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-colors duration-300 ease-out">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 transition-colors duration-300 ease-out">TiendaFit</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-300 ease-out">
              Inicio
            </Link>
            <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-300 ease-out">
              Productos
            </Link>
            <Link href="/cart" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-300 ease-out">
              Carrito
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              disabled={isLoading}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 text-center transition-all duration-300 ease-out">⏳</span>
              ) : theme === 'light' ? (
                <span className="inline-block w-5 h-5 text-center transition-all duration-300 ease-out">🌙</span>
              ) : (
                <span className="inline-block w-5 h-5 text-center transition-all duration-300 ease-out">☀️</span>
              )}
            </button>

            {/* Auth Buttons */}
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors duration-300 ease-out"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors duration-300 ease-out"
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Cart Button */}
            <Link href="/cart" className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95">
              Carrito ({getTotalItems()})
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}