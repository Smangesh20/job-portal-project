import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { ErrorPreventionProvider } from '@/components/providers/error-prevention-provider'
import InfiniteErrorBoundary from '@/components/error-boundaries/infinite-error-boundary'
import '@/lib/error-prevention-init'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layouts/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ask Ya Cham - Quantum Computing-Powered Job Matching Platform',
  description: 'Connect with opportunities that match your skills, values, and career aspirations. Our advanced quantum computing technology ensures perfect matches between talented professionals and innovative companies.',
  keywords: [
    'job matching',
    'quantum computing recruitment',
    'career opportunities',
    'talent acquisition',
    'job search',
    'employment',
    'career development',
    'professional networking'
  ],
  authors: [{ name: 'Ask Ya Cham Team' }],
  creator: 'Ask Ya Cham',
  publisher: 'Ask Ya Cham',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://askyacham.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://askyacham.com',
    title: 'Ask Ya Cham - Quantum Computing-Powered Job Matching Platform',
    description: 'Connect with opportunities that match your skills, values, and career aspirations.',
    siteName: 'Ask Ya Cham',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ask Ya Cham - Quantum Computing-Powered Job Matching Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ask Ya Cham - Quantum Computing-Powered Job Matching Platform',
    description: 'Connect with opportunities that match your skills, values, and career aspirations.',
    images: ['/og-image.jpg'],
    creator: '@askyacham',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.location.hostname === 'www.askyacham.com') {
                console.log('🔍 ULTIMATE redirect: www.askyacham.com -> askyacham.com');
                const currentUrl = window.location.href;
                const newUrl = currentUrl.replace('www.askyacham.com', 'askyacham.com');
                console.log('🔍 Redirecting to:', newUrl);
                
                // Ultimate solution: stop all execution immediately
                window.stop();
                window.location.replace(newUrl);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <InfiniteErrorBoundary>
          <ErrorBoundary>
            <ErrorPreventionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                <QueryProvider>
                  <AuthProvider>
                    <SocketProvider>
                      <Header />
                      {children}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'var(--background)',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                        },
                        success: {
                          iconTheme: {
                            primary: 'var(--primary)',
                            secondary: 'var(--primary-foreground)',
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: 'var(--destructive)',
                            secondary: 'var(--destructive-foreground)',
                          },
                        },
                      }}
                    />
                    </SocketProvider>
                  </AuthProvider>
                </QueryProvider>
              </ThemeProvider>
            </ErrorPreventionProvider>
          </ErrorBoundary>
        </InfiniteErrorBoundary>
      </body>
    </html>
  )
}