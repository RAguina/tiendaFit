'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'


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

export function debugCookies() {
  if (typeof window === 'undefined') return

  const cookies = document.cookie.split(';').map(cookie => cookie.trim())
  const authCookies = cookies.filter(cookie => 
    cookie.includes('next-auth') || cookie.includes('__Secure') || cookie.includes('__Host')
  )
  
  console.log('🍪 Auth Cookies:', authCookies)
  return authCookies
}

