'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

// Interceptor global para fetch - solo para debug
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    const url = args[0]
    if (typeof url === 'string' && url.includes('/api/auth/')) {
      console.log('🔍 FETCH INTERCEPTOR:', {
        method: args[1]?.method || 'GET',
        url: url,
        timestamp: new Date().toISOString()
      })
    }
    return originalFetch.apply(this, args)
  }
}

export function useDebugSession() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('🔍 Session Debug:', {
      status,
      hasSession: !!session,
      user: session?.user?.email,
      timestamp: new Date().toISOString()
    })
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
  if (typeof window === 'undefined') {
    console.log('🔴 CLEANUP: Skipping - window undefined (server side)')
    return
  }

  console.log('🔴 CLEANUP: Starting aggressive cleanup')
  
  // Clear all localStorage
  console.log('🔴 CLEANUP: Clearing localStorage and sessionStorage')
  localStorage.clear()
  sessionStorage.clear()

  // Clear all auth-related cookies aggressively
  console.log('🔴 CLEANUP: Getting all cookies')
  const allCookies = document.cookie.split(';')
  console.log('🔴 CLEANUP: Found cookies:', allCookies.length)
  
  allCookies.forEach((cookie, index) => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    
    console.log(`🔴 CLEANUP: Processing cookie ${index + 1}: "${name}"`)
    
    if (name.includes('next-auth') || name.includes('__Secure') || name.includes('__Host')) {
      console.log(`🔴 CLEANUP: Found auth cookie to delete: "${name}"`)
      // Clear for all possible domains/paths
      const domains = [
        '',
        `domain=${window.location.hostname}`,
        `domain=.${window.location.hostname}`,
        `domain=.${window.location.hostname.split('.').slice(-2).join('.')}`
      ]
      
      domains.forEach((domain, domainIndex) => {
        const cookieDelete1 = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain}`
        const cookieDelete2 = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api/auth; ${domain}`
        
        console.log(`🔴 CLEANUP: Deleting cookie with domain ${domainIndex + 1}: ${cookieDelete1}`)
        document.cookie = cookieDelete1
        document.cookie = cookieDelete2
      })
    }
  })

  console.log('🔴 CLEANUP: Forced cleanup completed')
  console.log('🔴 CLEANUP: Cookies remaining:', document.cookie.split(';').length)
}