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

    console.log('🔴 LOGOUT STARTED - Simplified approach')
    setIsLoading(true)
    
    try {
      // Clear cart before signing out (user-specific cart)  
      console.log('🔴 LOGOUT Step 1: Clearing cart')
      try {
        await clearCart()
        console.log('🔴 LOGOUT Step 1.1: Cart cleared successfully')
      } catch (cartError) {
        console.warn('🔴 LOGOUT Step 1.2: Error clearing cart during logout:', cartError)
      }
      
      // Call optional callback
      console.log('🔴 LOGOUT Step 2: Calling optional callback')
      onLogout?.()
      
      // Clear only non-httpOnly storage (localStorage, sessionStorage)
      console.log('🔴 LOGOUT Step 3: Clearing client storage only')
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Let NextAuth handle the logout properly with redirect
      console.log('🔴 LOGOUT Step 4: Using NextAuth signOut with redirect')
      await signOut({ 
        callbackUrl: '/',
        redirect: true  // Let NextAuth handle the redirect and cookie cleanup
      })
      
    } catch (error) {
      console.error('🔴 LOGOUT ERROR - Simplified catch block:', error)
      
      // Fallback: try NextAuth signout with redirect anyway
      console.log('🔴 LOGOUT FALLBACK: Trying NextAuth signout')
      try {
        await signOut({ 
          callbackUrl: '/',
          redirect: true 
        })
      } catch (signOutError) {
        console.error('🔴 LOGOUT FINAL ERROR:', signOutError)
        // Last resort: manual redirect
        window.location.replace('/')
      }
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