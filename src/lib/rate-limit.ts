// Simple rate limiting implementation

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  maxRequests?: number // Max requests per window
  message?: string
}

export function createRateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    maxRequests = 100, // 100 requests per window
    message = 'Too many requests, please try again later'
  } = options

  return function rateLimit(identifier: string): { success: boolean; message?: string; retryAfter?: number } {
    const now = Date.now()
    const key = identifier
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      cleanupExpiredEntries(now)
    }
    
    const entry = rateLimitStore.get(key)
    
    if (!entry) {
      // First request from this identifier
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return { success: true }
    }
    
    if (now > entry.resetTime) {
      // Window has expired, reset
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return { success: true }
    }
    
    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000) // seconds
      return {
        success: false,
        message,
        retryAfter
      }
    }
    
    // Increment count
    entry.count++
    return { success: true }
  }
}

function cleanupExpiredEntries(now: number) {
  const keysToDelete: string[] = []
  
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => rateLimitStore.delete(key))
}

// Pre-configured rate limiters for different endpoints
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again in 15 minutes'
})

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API calls per 15 minutes
  message: 'API rate limit exceeded, please try again later'
})

export const strictApiRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute for sensitive operations
  message: 'Rate limit exceeded for this operation, please wait a moment'
})

// Helper to get client identifier (IP address)
export function getClientIdentifier(request: Request): string {
  // Try different headers for IP address (useful behind proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('cf-connecting-ip') // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIp || clientIp || 'unknown'
}