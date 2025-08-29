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

    console.log('🔴 LOGOUT STARTED - Step 1: Initialize')
    setIsLoading(true)
    
    try {
      // Debug: Show cookies before logout
      console.log('🔴 LOGOUT Step 2: Checking cookies before logout')
      if (process.env.NODE_ENV === 'development') {
        console.log('🍪 Cookies before logout:', debugCookies())
      }
      
      // Clear cart before signing out (user-specific cart)  
      console.log('🔴 LOGOUT Step 3: Clearing cart')
      try {
        await clearCart()
        console.log('🔴 LOGOUT Step 3.1: Cart cleared successfully')
      } catch (cartError) {
        console.warn('🔴 LOGOUT Step 3.2: Error clearing cart during logout:', cartError)
      }
      
      // Call optional callback
      console.log('🔴 LOGOUT Step 4: Calling optional callback')
      onLogout?.()
      
      // Use our aggressive cleanup function
      console.log('🔴 LOGOUT Step 5: Running aggressive cleanup')
      forceLogoutCleanup()
      
      // Sign out with NextAuth API call directly
      console.log('🔴 LOGOUT Step 6: Attempting NextAuth API signout')
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
          console.error('🔴 LOGOUT Step 6.1: API signout response not OK:', response.status, response.statusText)
          throw new Error('Failed to sign out via API')
        }
        console.log('🔴 LOGOUT Step 6.2: API signout successful')
      } catch (apiError) {
        console.warn('🔴 LOGOUT Step 6.3: API signout failed, trying NextAuth signOut:', apiError)
        
        // Fallback to NextAuth signOut
        console.log('🔴 LOGOUT Step 7: Using NextAuth signOut fallback')
        await signOut({ 
          callbackUrl: '/',
          redirect: false 
        })
        console.log('🔴 LOGOUT Step 7.1: NextAuth signOut completed')
      }
      
      // Final cleanup after signout
      console.log('🔴 LOGOUT Step 8: Running final cleanup')
      forceLogoutCleanup()
      
      // Debug: Show cookies after logout
      console.log('🔴 LOGOUT Step 9: Checking cookies after logout')
      if (process.env.NODE_ENV === 'development') {
        console.log('🍪 Cookies after logout:', debugCookies())
      }
      
      // Wait a moment for cleanup to complete, then redirect
      console.log('🔴 LOGOUT Step 10: Preparing to redirect')
      setTimeout(() => {
        console.log('🔴 LOGOUT Step 11: Redirecting to home page')
        window.location.replace('/')
      }, 100)
      
    } catch (error) {
      console.error('🔴 LOGOUT ERROR - Catch block:', error)
      
      // Ultimate fallback: force cleanup and redirect
      console.log('🔴 LOGOUT FALLBACK: Running ultimate cleanup and redirect')
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