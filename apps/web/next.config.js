/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.askyacham.com',
          },
        ],
        destination: 'https://askyacham.com/:path*',
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