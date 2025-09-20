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

  // Images
  images: {
    domains: ['localhost', 'askyacham.com', 'www.askyacham.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Basic webpack config
  webpack: (config, { isServer }) => {
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
}

module.exports = nextConfig