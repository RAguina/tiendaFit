'use client'

import { signOut } from 'next-auth/react'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'
import { forceLogoutCleanup, debugCookies } from '@/hooks/use-debug-session'

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
      // Debug: Show cookies before logout
      if (process.env.NODE_ENV === 'development') {
        console.log('🍪 Cookies before logout:', debugCookies())
      }
      
      // Clear cart before signing out (user-specific cart)  
      try {
        await clearCart()
      } catch (cartError) {
        console.warn('Error clearing cart during logout:', cartError)
      }
      
      // Call optional callback
      onLogout?.()
      
      // Use our aggressive cleanup function
      forceLogoutCleanup()
      
      // Sign out with NextAuth API call directly
      try {
        const response = await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            csrfToken: await fetch('/api/auth/csrf')
              .then(res => res.json())
              .then(data => data.csrfToken)
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to sign out via API')
        }
      } catch (apiError) {
        console.warn('API signout failed, trying NextAuth signOut:', apiError)
        
        // Fallback to NextAuth signOut
        await signOut({ 
          callbackUrl: '/',
          redirect: false 
        })
      }
      
      // Final cleanup after signout
      forceLogoutCleanup()
      
      // Debug: Show cookies after logout
      if (process.env.NODE_ENV === 'development') {
        console.log('🍪 Cookies after logout:', debugCookies())
      }
      
      // Wait a moment for cleanup to complete, then redirect
      setTimeout(() => {
        window.location.replace('/')
      }, 100)
      
    } catch (error) {
      console.error('Error during logout:', error)
      
      // Ultimate fallback: force cleanup and redirect
      forceLogoutCleanup()
      window.location.replace('/')
    }
    // Don't set loading to false since we're redirecting anyway
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