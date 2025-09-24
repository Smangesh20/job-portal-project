import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { EnterpriseHeader } from '@/components/navigation/enterprise-header' // Removed - using clean headers in individual layouts
import { AuthProvider } from '@/components/providers/auth-provider'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ConnectionStatus, ConnectionBanner } from '@/components/ui/connection-status'
import { GoogleNetworkHandler } from '@/components/providers/google-error-boundary'
import { GlobalErrorBoundary } from '@/components/error-boundary/global-error-boundary'
import { initializeErrorPrevention } from '@/lib/error-prevention'
import { initializeCacheManagement } from '@/lib/cache-management'

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
      </head>
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <GoogleNetworkHandler>
            <AuthProvider>
              <NotificationProvider>
                <ConnectionBanner />
                {children}
                <ConnectionStatus />
              </NotificationProvider>
            </AuthProvider>
          </GoogleNetworkHandler>
        </GlobalErrorBoundary>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize error prevention and cache management
              (function() {
                try {
                  ${initializeErrorPrevention.toString()}();
                  ${initializeCacheManagement.toString()}();
                } catch (e) {
                  console.error('Initialization error:', e);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}