import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import { generateNonce } from "@/lib/security/nonce"
import { EXPECT_CT_CONFIG } from "@/lib/security/certificate-pinning"

function applySecurityHeaders(response: NextResponse, nonce?: string) {
  // Core Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Enhanced Permissions Policy
  response.headers.set('Permissions-Policy', [
    'camera=()', 
    'microphone=()', 
    'geolocation=()',
    'payment=(self)',
    'usb=()', 
    'magnetometer=()', 
    'accelerometer=()', 
    'gyroscope=()',
    'clipboard-read=(self)',
    'clipboard-write=(self)'
  ].join(', '))
  
  // Cross-Origin Policies
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site')
  
  // Additional Security Headers
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  
  // Remove Server Information
  response.headers.set('Server', 'TiendaFit')
  response.headers.delete('X-Powered-By')
  
  // HTTPS-only headers (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    
    // Certificate Transparency compliance
    if (EXPECT_CT_CONFIG.enabled) {
      const expectCTValue = [
        `max-age=${EXPECT_CT_CONFIG.maxAge}`,
        EXPECT_CT_CONFIG.enforce ? 'enforce' : '',
        EXPECT_CT_CONFIG.reportUri ? `report-uri="${EXPECT_CT_CONFIG.reportUri}"` : ''
      ].filter(Boolean).join(', ')
      
      response.headers.set('Expect-CT', expectCTValue)
    }
  }
  
  // Content Security Policy - Restrictive with nonce support
  const nonceDirective = nonce ? `'nonce-${nonce}'` : "";
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${nonceDirective} https://vercel.live https://*.vercel.com`,
    `style-src 'self' ${nonceDirective} https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.exchangerate-api.com https://*.vercel.app https://www.mercadopago.com https://api.mercadopago.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].filter(directive => directive.trim()).join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
}

function forceHTTPS(req: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers.get('x-forwarded-proto')
    if (proto && proto === 'http') {
      const redirectUrl = `https://${req.headers.get('host')}${req.nextUrl.pathname}${req.nextUrl.search}`
      return NextResponse.redirect(redirectUrl, 301)
    }
  }
  return null
}

export default withAuth(
  function middleware(req) {
    // Force HTTPS redirect if needed
    const httpsRedirect = forceHTTPS(req)
    if (httpsRedirect) {
      return httpsRedirect
    }
    
    const response = NextResponse.next()
    
    // Generate nonce for CSP
    const nonce = generateNonce()
    response.headers.set('x-nonce', nonce)
    
    // Apply security headers to all responses
    applySecurityHeaders(response, nonce)
    
    // Admin protection
    if (req.nextUrl.pathname.startsWith("/admin") && 
        req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all non-admin routes
        if (!req.nextUrl.pathname.startsWith("/admin")) return true
        // Admin routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - IMPORTANT: This excludes /api/auth/* for logout debugging
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}