/**
 * Security monitoring and alerting system
 * Tracks security events and anomalies
 */

import { securityLogger } from '@/lib/logger'

export interface SecurityEvent {
  type: SecurityEventType
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  userId?: string
  ip: string
  userAgent: string
  metadata?: Record<string, any>
  timestamp: Date
}

export type SecurityEventType = 
  | 'FAILED_LOGIN'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'CSP_VIOLATION'
  | 'HPKP_VIOLATION'
  | 'EXPECT_CT_VIOLATION'
  | 'UNAUTHORIZED_ACCESS'
  | 'SQL_INJECTION_ATTEMPT'
  | 'XSS_ATTEMPT'
  | 'CSRF_ATTEMPT'
  | 'PAYMENT_FRAUD'
  | 'DATA_BREACH_ATTEMPT'

class SecurityMonitor {
  private events: SecurityEvent[] = []
  private readonly MAX_EVENTS = 5000 // Prevent memory exhaustion
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000 // Cleanup every hour
  private lastCleanup = Date.now()
  
  private alertThresholds = {
    FAILED_LOGIN: { count: 5, window: 15 * 60 * 1000 }, // 5 failures in 15 minutes
    RATE_LIMIT_EXCEEDED: { count: 10, window: 60 * 1000 }, // 10 rate limits in 1 minute
    CSP_VIOLATION: { count: 5, window: 5 * 60 * 1000 }, // 5 violations in 5 minutes
    SUSPICIOUS_ACTIVITY: { count: 3, window: 60 * 1000 }, // 3 suspicious events in 1 minute
  }

  /**
   * Record a security event
   */
  recordEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    }

    this.events.push(fullEvent)
    
    // Log the event
    securityLogger.security(`Security event: ${event.type}`, {
      severity: event.severity,
      userId: event.userId,
      ip: this.anonymizeIP(event.ip),
      userAgent: event.userAgent?.substring(0, 200), // Truncate long user agents
      ...event.metadata
    })

    // Check for alert conditions
    this.checkAlertThresholds(fullEvent)

    // Proactive memory management
    this.cleanupEvents()
  }

  /**
   * Check if event patterns trigger alerts
   */
  private checkAlertThresholds(event: SecurityEvent): void {
    const threshold = this.alertThresholds[event.type as keyof typeof this.alertThresholds]
    if (!threshold) return

    const windowStart = new Date(event.timestamp.getTime() - threshold.window)
    const recentEvents = this.events.filter(e => 
      e.type === event.type && 
      e.timestamp >= windowStart &&
      (e.ip === event.ip || e.userId === event.userId)
    )

    if (recentEvents.length >= threshold.count) {
      this.triggerAlert({
        type: event.type,
        severity: 'HIGH',
        message: `Threshold exceeded: ${recentEvents.length} ${event.type} events`,
        events: recentEvents,
        affectedUser: event.userId,
        affectedIP: event.ip
      })
    }
  }

  /**
   * Trigger security alert
   */
  private triggerAlert(alert: {
    type: SecurityEventType
    severity: string
    message: string
    events: SecurityEvent[]
    affectedUser?: string
    affectedIP: string
  }): void {
    securityLogger.security(`SECURITY ALERT: ${alert.message}`, {
      alertType: alert.type,
      severity: alert.severity,
      eventCount: alert.events.length,
      affectedUser: alert.affectedUser,
      affectedIP: this.anonymizeIP(alert.affectedIP),
      timespan: `${alert.events[0]?.timestamp.toISOString()} - ${alert.events[alert.events.length - 1]?.timestamp.toISOString()}`
    })

    // In production, implement:
    // - Email alerts to security team
    // - Webhook notifications to monitoring services
    // - Slack/Discord notifications
    // - Automatic IP blocking for severe cases
    // - Dashboard updates

    if (process.env.NODE_ENV === 'production') {
      this.handleProductionAlert(alert)
    }
  }

  /**
   * Handle production alerts (email, webhooks, etc.)
   */
  private handleProductionAlert(alert: any): void {
    // Example implementations:
    
    // 1. Email alert
    if (process.env.SECURITY_ALERT_EMAIL) {
      console.log(`[PRODUCTION ALERT] Sending security alert email for ${alert.type}`)
      // Implementation would send email via service like SendGrid, Resend, etc.
    }

    // 2. Webhook notification
    if (process.env.SECURITY_WEBHOOK_URL) {
      console.log(`[PRODUCTION ALERT] Sending webhook notification for ${alert.type}`)
      // Implementation would POST to monitoring service
    }

    // 3. Automatic response for critical events
    if (alert.severity === 'CRITICAL') {
      console.log(`[PRODUCTION ALERT] Critical event detected, considering automatic response`)
      // Implementation might temporarily block IP, revoke sessions, etc.
    }
  }

  /**
   * Clean up old events to prevent memory exhaustion
   */
  private cleanupEvents(): void {
    const now = Date.now()
    
    // Only cleanup if interval has passed
    if (now - this.lastCleanup < this.CLEANUP_INTERVAL && this.events.length < this.MAX_EVENTS) {
      return
    }
    
    // Remove events older than 24 hours
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000)
    this.events = this.events.filter(event => event.timestamp >= oneDayAgo)
    
    // If still too many events, keep only the most recent ones
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.MAX_EVENTS)
    }
    
    this.lastCleanup = now
  }

  /**
   * Anonymize IP addresses for privacy
   */
  private anonymizeIP(ip: string): string {
    if (!ip || ip === 'unknown') return 'unknown'
    
    // IPv4: Keep first 3 octets, zero last one (192.168.1.0)
    if (ip.includes('.') && !ip.includes(':')) {
      const parts = ip.split('.')
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.0`
      }
    }
    
    // IPv6: Keep first 4 groups, zero rest (2001:db8:85a3:0::)
    if (ip.includes(':')) {
      const parts = ip.split(':')
      if (parts.length >= 4) {
        return `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}::`
      }
    }
    
    return 'anonymized'
  }

  /**
   * Get security statistics
   */
  getSecurityStats(timeWindow: number = 24 * 60 * 60 * 1000): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    topIPs: Array<{ ip: string; count: number }>
  } {
    const cutoff = new Date(Date.now() - timeWindow)
    const recentEvents = this.events.filter(e => e.timestamp >= cutoff)

    const eventsByType: Record<string, number> = {}
    const eventsBySeverity: Record<string, number> = {}
    const ipCounts: Record<string, number> = {}

    recentEvents.forEach(event => {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
      
      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1
      
      // Count by IP (anonymized)
      const anonIP = this.anonymizeIP(event.ip)
      ipCounts[anonIP] = (ipCounts[anonIP] || 0) + 1
    })

    const topIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalEvents: recentEvents.length,
      eventsByType,
      eventsBySeverity,
      topIPs
    }
  }

  /**
   * Check if IP should be temporarily blocked
   */
  shouldBlockIP(ip: string): boolean {
    const recentEvents = this.events.filter(e => 
      e.ip === ip && 
      e.timestamp >= new Date(Date.now() - 60 * 60 * 1000) && // Last hour
      ['HIGH', 'CRITICAL'].includes(e.severity)
    )

    // Block if more than 10 high-severity events in the last hour
    return recentEvents.length >= 10
  }
}

// Singleton instance
let securityMonitor: SecurityMonitor | null = null

export function getSecurityMonitor(): SecurityMonitor {
  if (!securityMonitor) {
    securityMonitor = new SecurityMonitor()
  }
  return securityMonitor
}

/**
 * Helper functions for common security events
 */
export function recordFailedLogin(ip: string, userAgent: string, email?: string): void {
  getSecurityMonitor().recordEvent({
    type: 'FAILED_LOGIN',
    severity: 'MEDIUM',
    ip,
    userAgent,
    metadata: { attemptedEmail: email }
  })
}

export function recordRateLimitExceeded(ip: string, userAgent: string, endpoint: string): void {
  getSecurityMonitor().recordEvent({
    type: 'RATE_LIMIT_EXCEEDED',
    severity: 'MEDIUM',
    ip,
    userAgent,
    metadata: { endpoint }
  })
}

export function recordCSPViolation(ip: string, userAgent: string, violatedDirective: string, blockedURI: string): void {
  getSecurityMonitor().recordEvent({
    type: 'CSP_VIOLATION',
    severity: 'HIGH',
    ip,
    userAgent,
    metadata: { violatedDirective, blockedURI }
  })
}

export function recordSuspiciousActivity(
  ip: string, 
  userAgent: string, 
  activity: string, 
  userId?: string
): void {
  getSecurityMonitor().recordEvent({
    type: 'SUSPICIOUS_ACTIVITY',
    severity: 'HIGH',
    ip,
    userAgent,
    userId,
    metadata: { activity }
  })
}

export default SecurityMonitor