import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { CartProvider } from '@/contexts/cart-context'
import { CurrencyProvider } from '@/contexts/currency-context'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ThemeScript from '@/components/theme-script'
import SessionProviderWrapper from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TiendaFit - Tu tienda de productos fitness',
  description: 'Encuentra los mejores productos para fitness y deportes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        <SessionProviderWrapper>
          <ThemeProvider>
            <CurrencyProvider>
              <CartProvider>
                <ThemeScript />
                <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}