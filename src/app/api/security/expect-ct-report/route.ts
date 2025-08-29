import { NextRequest, NextResponse } from 'next/server'
import { securityLogger } from '@/lib/logger'

interface ExpectCTReport {
  'date-time': string
  hostname: string
  port: number
  'effective-expiration-date': string
  'served-certificate-chain': string[]
  'scts': Array<{
    version: number
    'log-id': string
    timestamp: number
    extensions: string
    signature: string
  }>
}

/**
 * Handle Expect-CT violation reports
 * These reports indicate Certificate Transparency compliance issues
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

    const report: ExpectCTReport = await request.json()

    // Log the security violation
    securityLogger.security('Expect-CT violation reported', {
      hostname: report.hostname,
      port: report.port,
      dateTime: report['date-time'],
      effectiveExpirationDate: report['effective-expiration-date'],
      servedCertChainLength: report['served-certificate-chain']?.length || 0,
      sctsCount: report.scts?.length || 0,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown'
    })

    // Process the Certificate Transparency violation
    if (report.scts && report.scts.length === 0) {
      securityLogger.security('Certificate missing SCTs', {
        hostname: report.hostname,
        severity: 'HIGH'
      })
    }

    // In production, implement:
    // 1. Certificate monitoring and alerting
    // 2. Automatic certificate reissuance
    // 3. Integration with certificate management systems
    // 4. Dashboard updates for compliance monitoring

    if (process.env.NODE_ENV === 'production') {
      // Example: Alert security team about CT compliance issues
      if (process.env.SECURITY_ALERT_EMAIL && report.scts?.length === 0) {
        console.log(`URGENT: Certificate for ${report.hostname} missing CT SCTs`)
      }
    }

    return NextResponse.json({ status: 'received' }, { status: 200 })

  } catch (error) {
    securityLogger.security('Error processing Expect-CT report', {
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