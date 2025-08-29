/**
 * Nonce generation for CSP headers
 */
import { randomBytes } from 'crypto'

/**
 * Generate a cryptographically secure random nonce
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64')
}

/**
 * Get nonce from headers or generate a new one
 */
export function getNonce(headers: Headers): string {
  const existingNonce = headers.get('x-nonce')
  if (existingNonce) {
    return existingNonce
  }
  return generateNonce()
}