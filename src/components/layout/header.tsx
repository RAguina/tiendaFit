'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { useCart } from '@/contexts/cart-context'
import { useCurrency } from '@/contexts/currency-context'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { theme, toggleTheme, isLoading } = useTheme()
  const { getTotalItems } = useCart()
  const { currency, rates } = useCurrency()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

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
            {/* Currency Indicator */}
            <div className="hidden sm:flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">{currency}</span>
              {rates && (
                <div className="ml-1 w-2 h-2 bg-green-500 rounded-full" title="Tasas actualizadas"></div>
              )}
            </div>

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
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 ease-out"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                  </span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user?.name || "Usuario"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Cuenta
                      </Link>
                      
                      <Link
                        href="/account?section=orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mis Pedidos
                      </Link>
                      
                      <Link
                        href="/account?section=addresses"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Direcciones
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-600 py-2">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
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