'use client'

import { useEffect } from 'react'
import { getSRIAttributes, SECURE_FONT_CONFIG } from '@/lib/security/sri'

interface SecureResourceLoaderProps {
  resources?: Array<{
    url: string
    type: 'stylesheet' | 'script' | 'preconnect'
    integrity?: string
    crossorigin?: 'anonymous' | 'use-credentials'
  }>
}

/**
 * Component to securely load external resources with SRI validation
 */
export function SecureResourceLoader({ resources = [] }: SecureResourceLoaderProps) {
  useEffect(() => {
    // Add preconnect links for performance
    SECURE_FONT_CONFIG.preconnectDomains.forEach(domain => {
      const existingLink = document.querySelector(`link[href="${domain}"]`)
      if (!existingLink) {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      }
    })

    // Load custom resources
    resources.forEach(resource => {
      const existingElement = document.querySelector(
        resource.type === 'stylesheet' 
          ? `link[href="${resource.url}"]`
          : `script[src="${resource.url}"]`
      )

      if (!existingElement) {
        if (resource.type === 'stylesheet') {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = resource.url
          
          const sriAttributes = getSRIAttributes(resource.url)
          if (resource.integrity || sriAttributes.integrity) {
            link.integrity = resource.integrity || sriAttributes.integrity!
          }
          if (resource.crossorigin || sriAttributes.crossorigin) {
            link.crossOrigin = resource.crossorigin || sriAttributes.crossorigin!
          }
          
          document.head.appendChild(link)
        } else if (resource.type === 'script') {
          const script = document.createElement('script')
          script.src = resource.url
          script.async = true
          
          const sriAttributes = getSRIAttributes(resource.url)
          if (resource.integrity || sriAttributes.integrity) {
            script.integrity = resource.integrity || sriAttributes.integrity!
          }
          if (resource.crossorigin || sriAttributes.crossorigin) {
            script.crossOrigin = resource.crossorigin || sriAttributes.crossorigin!
          }
          
          document.head.appendChild(script)
        }
      }
    })
  }, [resources])

  return null
}

/**
 * Hook to securely load external resources
 */
export function useSecureResourceLoader(resources: SecureResourceLoaderProps['resources']) {
  useEffect(() => {
    if (!resources) return

    const loadedElements: HTMLElement[] = []

    resources.forEach(resource => {
      if (resource.type === 'stylesheet') {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = resource.url
        
        const sriAttributes = getSRIAttributes(resource.url)
        if (resource.integrity || sriAttributes.integrity) {
          link.integrity = resource.integrity || sriAttributes.integrity!
        }
        if (resource.crossorigin || sriAttributes.crossorigin) {
          link.crossOrigin = resource.crossorigin || sriAttributes.crossorigin!
        }
        
        document.head.appendChild(link)
        loadedElements.push(link)
      }
    })

    // Cleanup on unmount
    return () => {
      loadedElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    }
  }, [resources])
}

export default SecureResourceLoader