import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { ChatProvider } from '@/lib/chat-context'
import { CartAnimationProvider } from '@/lib/cart-animation-context'
import { ChatSupport } from '@/components/chat-support'
import { LoadingOverlay } from '@/components/loading-overlay'
import { ScrollToTop } from '@/components/scroll-to-top'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Império Modas | Moda Infantil',
    template: '%s | Império Modas',
  },
  description:
    'Império Modas - Moda infantil com qualidade, estilo e preço justo. Conjuntos, camisas, moletons, tênis, calças, bermudas, vestidos e acessórios. Entrega em Lages e região.',
  keywords: ['moda infantil', 'roupa infantil', 'lages', 'sc', 'imperio modas', 'conjuntos', 'tenis infantil'],
  authors: [{ name: 'Andrew Maia' }],
  creator: 'Andrew Maia',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Império Modas',
    title: 'Império Modas | Moda Infantil',
    description: 'Moda infantil com qualidade, estilo e preço justo. Entrega em Lages e região.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <CartAnimationProvider>
              <WishlistProvider>
                <ChatProvider>
                  {children}
                  <ScrollToTop />
                  <ChatSupport />
                  <Toaster position="top-center" richColors closeButton />
                  <LoadingOverlay />
                  <Analytics />
                </ChatProvider>
              </WishlistProvider>
            </CartAnimationProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
