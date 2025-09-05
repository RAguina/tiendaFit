# AGENTS.md - Development Context & Progress

## Current Development Status

### Completed Features ✅

#### Authentication System
- **Google OAuth Login**: Full NextAuth.js implementation with Prisma adapter
- **Role-based Access**: USER/ADMIN role support with JWT tokens
- **Session Management**: 30-day session persistence with automatic renewal
- **Security**: HTTPS-only, secure cookies, comprehensive callback logging

#### User Panel (Account Management)
- **Profile Management**: Complete user profile editing functionality
- **Order History**: Real-time order status tracking with expandable views
- **Address Management**: Full CRUD operations for shipping addresses
- **Account Settings**: User preferences and account configuration
- **Responsive Design**: Mobile-first interface with hash-based navigation

#### Checkout & E-commerce
- **Complete Checkout Flow**: Cart validation → Address selection → Payment → Order creation
- **MercadoPago Integration**: Full SDK v2.8.0 implementation with webhook support
- **Payment Methods**: Credit/debit cards, bank transfers, digital wallets, cash payments
- **Order Management**: Complete order lifecycle with status tracking
- **Security**: Input sanitization, rate limiting, XSS protection

### In Progress 🚧
- End-to-end testing of complete checkout flow
- Production webhook signature validation
- MercadoPago production environment configuration

### Technical Architecture

#### Core Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with Google Provider
- **Payments**: MercadoPago SDK v2.8.0
- **Security**: DOMPurify, rate limiting, comprehensive security headers

#### Database Schema (Prisma)
- **Users**: Authentication with role-based access
- **Products**: Complete catalog with categories and reviews
- **Orders**: Full order lifecycle with detailed tracking
- **Addresses**: User shipping address management
- **Cart**: Persistent shopping cart implementation
- **Payments**: Payment record audit trail

#### API Structure
```
/api/
├── auth/[...nextauth]       # NextAuth authentication
├── addresses/               # Address CRUD operations
├── cart/                   # Shopping cart management
├── orders/                 # Order management
├── payments/create/        # MercadoPago payment creation
├── products/              # Product catalog
└── webhooks/mercadopago/  # Payment notifications
```

#### Security Implementation
- **Middleware Security**: Complete OWASP headers, HTTPS enforcement
- **Input Sanitization**: DOMPurify + server-side HTML entity encoding
- **Rate Limiting**: Memory-based with Redis-compatible design
- **CSP Policy**: Comprehensive Content Security Policy
- **Admin Protection**: Role-based route access control

### Architecture Patterns Used
1. **API Routes Pattern**: Uses Next.js API routes instead of Server Actions for all CRUD operations
2. **Context API**: React Context for client-side state management (cart, theme, currency)
3. **BFF Pattern**: Backend-for-Frontend with comprehensive validation and security
4. **Mock Data Strategy**: Structured mock data ready for database seeding

### Key Files & Components

#### Authentication
- `src/lib/auth/config.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API route

#### User Panel
- `src/app/account/page.tsx` - Main account page
- `src/components/account/` - Account management components

#### Checkout
- `src/app/(shop)/checkout/page.tsx` - Checkout interface
- `src/app/api/orders/route.ts` - Order processing API
- `src/app/api/payments/create/route.ts` - Payment creation

#### Security & Utils
- `middleware.ts` - Security middleware
- `src/lib/sanitize.ts` - Input sanitization
- `src/lib/rate-limit.ts` - Rate limiting

### Current Issues & Next Steps

#### ⚠️ Areas for Future Enhancement
- **Admin Panel**: Component placeholders ready for implementation
- **Product Seeding**: Mock data ready for database seeding
- **Production Webhook**: Signature validation implemented, ready for production
- **Rate Limiting**: Memory-based system implemented, Redis upgrade recommended for scale

#### 🔧 Configuration Requirements
- MercadoPago API keys (TEST and PROD environments)
- Google OAuth credentials verification
- PostgreSQL database connection strings
- Complete environment variables setup

#### 📋 Testing Checklist
- [ ] End-to-end checkout flow testing
- [ ] MercadoPago webhook validation
- [ ] Payment status updates verification  
- [ ] Order management workflow testing
- [ ] Security headers validation
- [ ] Rate limiting functionality testing

### Development Notes
- **Repository Status**: Clean with latest commits focused on complete payment integration
- **Architecture**: Well-structured with proper separation of concerns
- **Security**: Comprehensive security implementation following OWASP guidelines
- **Performance**: Optimized with Next.js App Router and efficient component organization
- **Scalability**: Designed for production with proper database relationships and API structure

---
*Last updated: 2025-09-05*
*Context: Code cleanup completed, documentation updated to reflect real architecture*
*Next: Admin panel implementation or production deployment preparation*