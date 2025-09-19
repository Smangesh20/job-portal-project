/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirects disabled to prevent infinite loops
  // Handle www redirects at DNS/CDN level instead
  async redirects() {
    return []
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