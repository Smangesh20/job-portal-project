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
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig