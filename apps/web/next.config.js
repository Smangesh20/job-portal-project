/** @type {import('next').NextConfig} */

// Fix for 'self is not defined' error during build
if (typeof globalThis !== 'undefined') {
  globalThis.self = globalThis;
}
if (typeof global !== 'undefined') {
  global.self = global;
}
if (typeof self === 'undefined') {
  global.self = global;
}

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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enhanced caching configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
  // PWA configuration
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ]
  },
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Fix for 'self is not defined' error during build
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Define global variables for server-side rendering
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.DefinePlugin({
          'self': 'globalThis',
        })
      );
      
      // Add global polyfill for self
      config.plugins.push(
        new webpack.ProvidePlugin({
          'self': 'globalThis',
        })
      );
      
      // Add banner plugin to inject polyfill at the top of every file
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'if (typeof self === "undefined") { var self = globalThis || global; }',
          raw: true,
          entryOnly: false,
        })
      );
      
      // Fix webpack runtime issues
      config.optimization = config.optimization || {};
      config.optimization.runtimeChunk = false;
      
      // Add additional safety checks
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        })
      );
    }

    // Ensure middleware is not affected by webpack optimizations
    // Exclude middleware from webpack optimizations
    if (config.externals) {
      config.externals.push({
        './middleware': 'commonjs ./middleware',
      });
    }

    // Optimize bundle size
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
        },
      };
    }

    return config;
  },
  // Environment variables
  env: {
    CACHE_VERSION: '2.0.0',
    BUILD_TIME: new Date().toISOString(),
  },
  // Output configuration
  output: 'standalone',
  // Trailing slash configuration
  trailingSlash: false,
  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.askyacham.com' : '',
}

module.exports = nextConfig