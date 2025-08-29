'use client'

import { signOut } from 'next-auth/react'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'

interface LogoutButtonProps {
  children: React.ReactNode
  className?: string
  onLogout?: () => void
}

export default function LogoutButton({ 
  children, 
  className = '', 
  onLogout 
}: LogoutButtonProps) {
  const { clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Clear cart before signing out (user-specific cart)
      await clearCart()
      
      // Call optional callback
      onLogout?.()
      
      // Sign out with redirect to home page
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Error during logout:', error)
      
      // Force redirect as fallback
      window.location.href = '/'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cerrando sesión...
        </span>
      ) : (
        children
      )}
    </button>
  )
}