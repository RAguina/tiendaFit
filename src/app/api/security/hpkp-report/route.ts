import { NextRequest, NextResponse } from 'next/server'
import { securityLogger } from '@/lib/logger'

interface HPKPReport {
  'date-time': string
  hostname: string
  port: number
  'effective-expiration-date': string
  'include-subdomains': boolean
  'noted-hostname': string
  'served-certificate-chain': string[]
  'validated-certificate-chain': string[]
  'known-pins': string[]
}

/**
 * Handle HPKP violation reports
 * These reports indicate potential certificate pinning issues
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    const report: HPKPReport = await request.json()

    // Log the security violation
    securityLogger.security('HPKP violation reported', {
      hostname: report.hostname,
      port: report.port,
      dateTime: report['date-time'],
      notedHostname: report['noted-hostname'],
      includeSubdomains: report['include-subdomains'],
      knownPinsCount: report['known-pins']?.length || 0,
      servedCertChainLength: report['served-certificate-chain']?.length || 0,
      validatedCertChainLength: report['validated-certificate-chain']?.length || 0,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown'
    })

    // In production, you might want to:
    // 1. Store reports in a database
    // 2. Send alerts to security team
    // 3. Trigger certificate rotation if needed
    // 4. Update monitoring dashboards

    if (process.env.NODE_ENV === 'production') {
      // Example: Send alert to security team
      if (process.env.SECURITY_ALERT_EMAIL) {
        // Implementation would send email alert
        console.log(`Security alert: HPKP violation for ${report.hostname}`)
      }
      
      // Example: Store in database for analysis
      // await storeSecurityReport('hpkp-violation', report)
    }

    return NextResponse.json({ status: 'received' }, { status: 200 })

  } catch (error) {
    securityLogger.security('Error processing HPKP report', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userAgent: request.headers.get('user-agent')
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}