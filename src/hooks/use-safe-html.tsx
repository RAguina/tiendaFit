'use client'

import { useMemo } from 'react'
import { sanitizeUserInput, sanitizeRichText } from '@/lib/sanitize'

// Hook for safely displaying user-generated content
export function useSafeHTML(html: string, type: 'text' | 'rich' = 'text') {
  return useMemo(() => {
    if (!html) return ''
    
    if (type === 'rich') {
      return sanitizeRichText(html)
    }
    
    return sanitizeUserInput(html)
  }, [html, type])
}

// Component for safely rendering HTML
interface SafeHTMLProps {
  html: string
  type?: 'text' | 'rich'
  className?: string
}

export function SafeHTML({ html, type = 'text', className }: SafeHTMLProps) {
  const safeHTML = useSafeHTML(html, type)
  
  if (type === 'text') {
    return <div className={className}>{safeHTML}</div>
  }
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  )
}