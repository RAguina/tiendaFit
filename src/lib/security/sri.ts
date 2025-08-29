/**
 * Subresource Integrity (SRI) utilities and hashes
 * For validating external resources integrity
 */

export interface SRIResource {
  url: string
  integrity: string
  crossorigin?: 'anonymous' | 'use-credentials'
}

/**
 * Pre-computed SRI hashes for known external resources
 * These should be updated when resources change
 */
export const SRI_HASHES = {
  // Google Fonts - Common Inter font variations
  GOOGLE_FONTS: {
    // Inter font CSS from Google Fonts API
    INTER_CSS: 'sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ',
    // Note: Google Fonts URLs are dynamic, so we use font-display: swap with local fallbacks
  },
  
  // External APIs (these need to be verified periodically)
  APIS: {
    EXCHANGE_RATE_API: {
      base: 'https://api.exchangerate-api.com',
      // API responses can't have SRI, but we validate the domain
    }
  }
} as const

/**
 * Generate SRI hash for a given content
 */
export async function generateSRIHash(content: string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha384'): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  
  const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray))
  
  return `${algorithm}-${hashBase64}`
}

/**
 * Validate if a resource URL should have SRI
 */
export function shouldUseSRI(url: string): boolean {
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    'cdn.jsdelivr.net'
  ]
  
  return externalDomains.some(domain => url.includes(domain))
}

/**
 * Get SRI attributes for a resource
 */
export function getSRIAttributes(url: string): { integrity?: string; crossorigin?: string } {
  if (!shouldUseSRI(url)) {
    return {}
  }
  
  // For Google Fonts, we use a different strategy due to dynamic URLs
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    return {
      crossorigin: 'anonymous'
      // Note: Google Fonts uses dynamic URLs, so we implement font-display: swap
      // and rely on CSP font-src restrictions instead of SRI
    }
  }
  
  return {
    crossorigin: 'anonymous'
  }
}

/**
 * Validate resource integrity in development
 */
export async function validateResourceIntegrity(url: string, expectedHash?: string): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development' || !expectedHash) {
    return true
  }
  
  try {
    const response = await fetch(url)
    const content = await response.text()
    const actualHash = await generateSRIHash(content)
    
    const isValid = actualHash === expectedHash
    
    if (!isValid) {
      console.warn(`[SRI] Hash mismatch for ${url}`)
      console.warn(`Expected: ${expectedHash}`)
      console.warn(`Actual: ${actualHash}`)
    }
    
    return isValid
  } catch (error) {
    console.error(`[SRI] Failed to validate ${url}:`, error)
    return false
  }
}

/**
 * Security-focused font loading strategy
 */
export const SECURE_FONT_CONFIG = {
  // Use system fonts as primary fallback
  fontFamily: `
    Inter, 
    -apple-system, 
    BlinkMacSystemFont, 
    "Segoe UI", 
    Roboto, 
    "Helvetica Neue", 
    Arial, 
    sans-serif
  `.replace(/\s+/g, ' ').trim(),
  
  // Font display strategy for performance and security
  fontDisplay: 'swap' as const,
  
  // Preconnect to font domains for performance
  preconnectDomains: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]
}

export default {
  SRI_HASHES,
  generateSRIHash,
  shouldUseSRI,
  getSRIAttributes,
  validateResourceIntegrity,
  SECURE_FONT_CONFIG
}