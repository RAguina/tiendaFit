/**
 * Secure logging utility that prevents logging in production
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info'

interface LogContext {
  [key: string]: any
}

/**
 * Safe logger that only logs in development environment
 */
export const logger = {
  /**
   * Log general information - only in development
   */
  log: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      if (context) {
        console.log(message, context)
      } else {
        console.log(message)
      }
    }
  },

  /**
   * Log errors - always logged but sanitized in production
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error, context)
    } else {
      // In production, only log the message without potentially sensitive error details
      console.error(`[ERROR] ${message}`)
    }
  },

  /**
   * Log warnings - only in development
   */
  warn: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      if (context) {
        console.warn(message, context)
      } else {
        console.warn(message)
      }
    }
  },

  /**
   * Log info - only in development
   */
  info: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      if (context) {
        console.info(message, context)
      } else {
        console.info(message)
      }
    }
  },

  /**
   * Debug logging for sensitive operations - never logged in production
   */
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context)
    }
  }
}

/**
 * Security-focused logger for API routes and auth operations
 */
export const securityLogger = {
  /**
   * Log authentication events
   */
  auth: (message: string, userId?: string, context?: Omit<LogContext, 'userId'>) => {
    logger.log(`[AUTH] ${message}`, {
      userId: userId ? `user_${userId.slice(0, 8)}***` : 'anonymous',
      timestamp: new Date().toISOString(),
      ...context
    })
  },

  /**
   * Log API access events
   */
  api: (method: string, path: string, status: number, userId?: string) => {
    logger.log(`[API] ${method} ${path} -> ${status}`, {
      userId: userId ? `user_${userId.slice(0, 8)}***` : 'anonymous',
      timestamp: new Date().toISOString()
    })
  },

  /**
   * Log security violations or suspicious activity
   */
  security: (message: string, context?: LogContext) => {
    // Security events should be logged even in production (but safely)
    const timestamp = new Date().toISOString()
    
    if (process.env.NODE_ENV === 'production') {
      console.error(`[SECURITY] ${timestamp} - ${message}`)
    } else {
      console.error(`[SECURITY] ${message}`, { timestamp, ...context })
    }
  },

  /**
   * Log payment and financial operations
   */
  payment: (message: string, orderId?: string, amount?: number) => {
    logger.log(`[PAYMENT] ${message}`, {
      orderId: orderId ? `order_${orderId.slice(0, 8)}***` : undefined,
      amount: amount ? `$${amount.toFixed(2)}` : undefined,
      timestamp: new Date().toISOString()
    })
  }
}

export default logger