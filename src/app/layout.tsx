import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { CartProvider } from '@/contexts/cart-context'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import DebugTheme from '@/components/debug-theme'

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback: remove dark class if there's any error
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <DebugTheme />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}