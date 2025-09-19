/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect common auth routes to their correct paths
      {
        source: '/register',
        destination: '/auth/register',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/forgot-password',
        destination: '/auth/forgot-password',
        permanent: true,
      },
      {
        source: '/reset-password',
        destination: '/auth/reset-password',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    domains: ['localhost', 'askyacham.com', 'www.askyacham.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig