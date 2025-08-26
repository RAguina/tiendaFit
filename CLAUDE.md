# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TiendaFit is a Next.js 14 e-commerce application for fitness products, built with TypeScript, Tailwind CSS, and NextAuth for authentication. The project uses a layered architecture with clear separation between components, business logic, and data access.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Architecture & Structure

### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Database**: Prisma ORM (schema not yet configured)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4 (alpha) with custom design system
- **Validation**: Zod schemas
- **UI Components**: Custom components with class-variance-authority

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Auth route group (login, register)
│   ├── (shop)/         # Shop route group (products, cart, checkout)
│   ├── admin/          # Admin panel pages
│   └── api/            # API routes
├── components/         # Reusable UI components
│   ├── admin/         # Admin-specific components
│   ├── cart/          # Cart functionality components
│   ├── layout/        # Layout components (header, footer, nav)
│   ├── product/       # Product-related components
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
├── lib/               # Business logic and utilities
│   ├── actions/       # Server actions
│   ├── auth/          # Authentication configuration
│   ├── db/            # Database schema and utilities
│   └── validations/   # Zod validation schemas
└── types/             # TypeScript type definitions
```

### Key Patterns

**Path Aliases**: The project uses TypeScript path aliases:
- `@/*` maps to `./src/*`
- `@/components/*` maps to `./src/components/*`
- `@/lib/*` maps to `./src/lib/*`
- `@/types/*` maps to `./src/types/*`
- `@/hooks/*` maps to `./src/hooks/*`

**Component Organization**: Components are grouped by feature/domain (admin, cart, product, etc.) with shared UI components in the `ui/` directory.

**State Management**: Uses custom React hooks in the `hooks/` directory for managing state (auth, cart, products).

**Validation**: Zod schemas are organized by domain in `lib/validations/` and referenced in both client and server components.

**Styling**: Custom Tailwind configuration with extended color palette (primary blues, custom grays) and animations. Uses `clsx` for conditional classes via the `cn()` utility.

### Route Groups
The app uses Next.js route groups to organize related pages:
- `(auth)` - Authentication pages (login, register)  
- `(shop)` - Customer-facing shop pages (products, cart, checkout)
- `admin` - Admin panel pages (unprotected route group)

### Authentication Flow
NextAuth.js is configured but the actual providers and database connection need to be set up. Authentication logic is centralized in `lib/auth/config.ts` and `lib/actions/auth.ts`.

## Important Notes

- The project uses Tailwind CSS v4 alpha - be mindful of potential breaking changes
- Database schema and Prisma configuration appear incomplete
- Environment variables are not fully configured (empty .env.example)
- Authentication providers need configuration
- Admin routes may need authentication protection