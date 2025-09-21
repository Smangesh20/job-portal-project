/** @type {import('next').NextConfig} */

const nextConfig = {
  // Basic redirects
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/auth/register',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: false,
      },
    ]
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' ws: wss:; frame-ancestors 'none';",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },

  // Images
  images: {
    domains: ['localhost', 'askyacham.com', 'www.askyacham.com'],
    formats: ['image/webp', 'image/avif'],
  },


  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Basic webpack config
  webpack: (config, { isServer, dev }) => {
    // Security: Remove source maps in production
    if (!dev && !isServer) {
      config.devtool = false;
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Output
  output: 'standalone',

  // Security: Disable debug features in production
  experimental: {
    ...(process.env.NODE_ENV === 'production' && {
      serverComponentsExternalPackages: ['@prisma/client'],
    }),
  },

}

module.exports = nextConfig