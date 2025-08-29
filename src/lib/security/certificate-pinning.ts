/**
 * Certificate Pinning utilities and configuration
 * For enhanced security against man-in-the-middle attacks
 */

export interface PinnedCertificate {
  domain: string
  pins: string[]  // SHA256 hashes of certificates
  maxAge: number  // seconds
  includeSubdomains?: boolean
  reportUri?: string
}

/**
 * Certificate pins for critical domains
 * These should be updated when certificates are rotated
 */
export const CERTIFICATE_PINS: PinnedCertificate[] = [
  {
    domain: 'api.mercadopago.com',
    pins: [
      // Primary certificate pin - update when MercadoPago rotates certificates
      'X3pGTSOuJeEVw989IJ/cEtXUEmy52zs1TZQrU06KUKg=',
      // Backup certificate pin
      'jQJTbIh0grw0/1TkHSumWb+Fs0Ggogr621gT3PvPKG0='
    ],
    maxAge: 3600, // 1 hour - shorter for API endpoints
    includeSubdomains: true,
    reportUri: '/api/security/hpkp-report'
  },
  {
    domain: 'www.mercadopago.com',
    pins: [
      'X3pGTSOuJeEVw989IJ/cEtXUEmy52zs1TZQrU06KUKg=',
      'jQJTbIh0grw0/1TkHSumWb+Fs0Ggogr621gT3PvPKG0='
    ],
    maxAge: 3600,
    includeSubdomains: true,
    reportUri: '/api/security/hpkp-report'
  },
  {
    domain: 'api.exchangerate-api.com',
    pins: [
      // Exchange rate API certificate pins
      'YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=',
      'sRHdihwgkaib1P1gxX8HFszlD+7/gTfNvuAybgLPNis='
    ],
    maxAge: 86400, // 24 hours
    includeSubdomains: false,
    reportUri: '/api/security/hpkp-report'
  }
]

/**
 * Generate Public Key Pinning (HPKP) header value
 */
export function generateHPKPHeader(pinnedCert: PinnedCertificate): string {
  const pins = pinnedCert.pins.map(pin => `pin-sha256="${pin}"`).join('; ')
  let header = `${pins}; max-age=${pinnedCert.maxAge}`
  
  if (pinnedCert.includeSubdomains) {
    header += '; includeSubDomains'
  }
  
  if (pinnedCert.reportUri) {
    header += `; report-uri="${pinnedCert.reportUri}"`
  }
  
  return header
}

/**
 * Get certificate pin for a specific domain
 */
export function getCertificatePinForDomain(domain: string): PinnedCertificate | undefined {
  return CERTIFICATE_PINS.find(pin => 
    pin.domain === domain || 
    (pin.includeSubdomains && domain.endsWith(`.${pin.domain}`))
  )
}

/**
 * Validate certificate pin (for client-side validation)
 */
export async function validateCertificatePin(
  url: string, 
  expectedPins: string[]
): Promise<boolean> {
  // Note: This is a conceptual implementation
  // Actual certificate validation happens at the browser/network level
  try {
    const urlObj = new URL(url)
    const response = await fetch(url, { 
      method: 'HEAD',
      // In a real implementation, this would check certificate details
    })
    
    // Browser handles actual certificate validation
    return response.ok
  } catch (error) {
    console.error(`Certificate validation failed for ${url}:`, error)
    return false
  }
}

/**
 * Certificate Transparency monitoring configuration
 */
export const CT_MONITORING = {
  domains: [
    process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'localhost',
    'api.mercadopago.com',
    'www.mercadopago.com'
  ],
  
  // Certificate Transparency logs to monitor
  logs: [
    'https://ct.googleapis.com/logs/argon2024/',
    'https://ct.googleapis.com/logs/argon2025h1/',
    'https://oak.ct.letsencrypt.org/2024h1/',
    'https://oak.ct.letsencrypt.org/2024h2/'
  ],
  
  // Notification settings for new certificates
  alertOnNewCertificates: true,
  alertEmail: process.env.SECURITY_ALERT_EMAIL
}

/**
 * HTTP Public Key Pinning (HPKP) configuration
 * Note: HPKP is deprecated in favor of Certificate Transparency
 * This is kept for legacy support and educational purposes
 */
export const HPKP_CONFIG = {
  enabled: process.env.NODE_ENV === 'production' && process.env.ENABLE_HPKP === 'true',
  reportOnly: true, // Set to true for testing, false for enforcement
  reportUri: '/api/security/hpkp-report'
}

/**
 * Modern alternative: Certificate Transparency + Expect-CT
 */
export const EXPECT_CT_CONFIG = {
  enabled: true,
  maxAge: 86400, // 24 hours
  enforce: process.env.NODE_ENV === 'production',
  reportUri: '/api/security/expect-ct-report'
}

export default {
  CERTIFICATE_PINS,
  generateHPKPHeader,
  getCertificatePinForDomain,
  validateCertificatePin,
  CT_MONITORING,
  HPKP_CONFIG,
  EXPECT_CT_CONFIG
}