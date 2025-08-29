'use client'

import { useEffect } from 'react'

interface NonceScriptProps {
  children: string
  id?: string
}

/**
 * Component to safely execute inline scripts with nonce support
 */
export function NonceScript({ children, id }: NonceScriptProps) {
  useEffect(() => {
    // Get nonce from meta tag or headers
    const nonceElement = document.querySelector('meta[name="csp-nonce"]')
    const nonce = nonceElement?.getAttribute('content')
    
    if (nonce) {
      const script = document.createElement('script')
      script.nonce = nonce
      script.textContent = children
      if (id) script.id = id
      
      document.head.appendChild(script)
      
      return () => {
        const existingScript = document.getElementById(id || 'temp-script')
        if (existingScript) {
          existingScript.remove()
        }
      }
    } else {
      // Fallback: execute directly if nonce not available (development)
      try {
        const func = new Function(children)
        func()
      } catch (error) {
        console.error('Error executing script:', error)
      }
    }
  }, [children, id])

  return null
}

/**
 * Hook to get the current nonce value
 */
export function useNonce(): string | null {
  if (typeof window === 'undefined') return null
  
  const nonceElement = document.querySelector('meta[name="csp-nonce"]')
  return nonceElement?.getAttribute('content') || null
}