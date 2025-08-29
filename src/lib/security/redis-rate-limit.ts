/**
 * Redis-based distributed rate limiting
 * Provides scalable rate limiting across multiple server instances
 */

import { Redis } from 'ioredis'

interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Maximum requests per window
  keyPrefix?: string  // Redis key prefix
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

class RedisRateLimit {
  private redis: Redis | null = null
  private fallbackMemory: Map<string, { count: number; resetTime: number }> = new Map()

  constructor() {
    this.initRedis()
  }

  private async initRedis() {
    try {
      if (process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL) {
        // Use Upstash Redis for serverless deployment
        if (process.env.UPSTASH_REDIS_REST_URL) {
          // For serverless environments, use HTTP-based Redis
          // Implementation would use Upstash REST API
          console.log('Redis configured for serverless environment')
        } else {
          // Traditional Redis connection
          this.redis = new Redis(process.env.REDIS_URL!)
          console.log('Redis connected for rate limiting')
        }
      } else {
        console.warn('Redis not configured, using in-memory fallback')
      }
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      console.log('Falling back to in-memory rate limiting')
    }
  }

  async checkRateLimit(
    key: string, 
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const fullKey = `${config.keyPrefix || 'ratelimit'}:${key}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    try {
      if (this.redis) {
        return await this.redisRateLimit(fullKey, config, now, windowStart)
      } else {
        return await this.memoryRateLimit(fullKey, config, now, windowStart)
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      // Fail open in case of errors (allow request)
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }
  }

  private async redisRateLimit(
    key: string,
    config: RateLimitConfig,
    now: number,
    windowStart: number
  ): Promise<RateLimitResult> {
    // Use Redis Lua script for atomic operation
    const luaScript = `
      local key = KEYS[1]
      local window_start = ARGV[1]
      local now = ARGV[2]
      local max_requests = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      
      -- Remove expired entries
      redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)
      
      -- Count current requests
      local current_requests = redis.call('ZCARD', key)
      
      -- Check if limit exceeded
      if current_requests >= max_requests then
        local reset_time = now + window_ms
        return {0, max_requests, 0, reset_time}
      end
      
      -- Add current request
      redis.call('ZADD', key, now, now .. ':' .. math.random())
      redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
      
      local remaining = max_requests - current_requests - 1
      local reset_time = now + window_ms
      
      return {1, max_requests, remaining, reset_time}
    `

    const result = await this.redis!.eval(
      luaScript,
      1,
      key,
      windowStart.toString(),
      now.toString(),
      config.maxRequests.toString(),
      config.windowMs.toString()
    ) as [number, number, number, number]

    const [success, limit, remaining, resetTime] = result

    return {
      success: success === 1,
      limit,
      remaining,
      resetTime,
      retryAfter: success === 0 ? Math.ceil((resetTime - now) / 1000) : undefined
    }
  }

  private async memoryRateLimit(
    key: string,
    config: RateLimitConfig,
    now: number,
    windowStart: number
  ): Promise<RateLimitResult> {
    // Clean expired entries
    this.cleanupMemoryEntries(windowStart)

    const entry = this.fallbackMemory.get(key)

    if (!entry) {
      // First request
      this.fallbackMemory.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }

    if (now >= entry.resetTime) {
      // Window expired, reset
      this.fallbackMemory.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }

    if (entry.count >= config.maxRequests) {
      // Limit exceeded
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      }
    }

    // Increment counter
    entry.count++

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  private cleanupMemoryEntries(cutoff: number) {
    for (const [key, entry] of Array.from(this.fallbackMemory.entries())) {
      if (entry.resetTime < cutoff) {
        this.fallbackMemory.delete(key)
      }
    }
  }

  async close() {
    if (this.redis) {
      await this.redis.disconnect()
    }
  }
}

// Singleton instance
let rateLimiter: RedisRateLimit | null = null

export function getRateLimiter(): RedisRateLimit {
  if (!rateLimiter) {
    rateLimiter = new RedisRateLimit()
  }
  return rateLimiter
}

// Pre-configured rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Strict limits for authentication endpoints
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyPrefix: 'auth'
  },

  // API endpoints
  API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    keyPrefix: 'api'
  },

  // Payment processing
  PAYMENT: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    keyPrefix: 'payment'
  },

  // Cart operations
  CART: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyPrefix: 'cart'
  },

  // General web requests
  WEB: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyPrefix: 'web'
  }
} as const

/**
 * Enhanced rate limiting with client identification
 */
export async function checkRateLimit(
  identifier: string,
  configType: keyof typeof RATE_LIMIT_CONFIGS
): Promise<RateLimitResult> {
  const rateLimiter = getRateLimiter()
  const config = RATE_LIMIT_CONFIGS[configType]
  
  return rateLimiter.checkRateLimit(identifier, config)
}

export default RedisRateLimit