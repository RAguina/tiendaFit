'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function useDebugSession() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Session Debug:', {
        status,
        hasSession: !!session,
        user: session?.user?.email,
        timestamp: new Date().toISOString()
      })
    }
  }, [session, status])

  return { session, status }
}

// Utility function to check all cookies
export function debugCookies() {
  if (typeof window === 'undefined') return

  const cookies = document.cookie.split(';').map(cookie => cookie.trim())
  const authCookies = cookies.filter(cookie => 
    cookie.includes('next-auth') || cookie.includes('__Secure') || cookie.includes('__Host')
  )
  
  console.log('🍪 Auth Cookies:', authCookies)
  
  return authCookies
}

// Force clear all auth-related data
export function forceLogoutCleanup() {
  if (typeof window === 'undefined') return

  // Clear all localStorage
  localStorage.clear()
  sessionStorage.clear()

  // Clear all auth-related cookies aggressively
  const allCookies = document.cookie.split(';')
  
  allCookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    
    if (name.includes('next-auth') || name.includes('__Secure') || name.includes('__Host')) {
      // Clear for all possible domains/paths
      const domains = [
        '',
        `domain=${window.location.hostname}`,
        `domain=.${window.location.hostname}`,
        `domain=.${window.location.hostname.split('.').slice(-2).join('.')}`
      ]
      
      domains.forEach(domain => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api/auth; ${domain}`
      })
    }
  })

  console.log('🧹 Forced cleanup completed')
}