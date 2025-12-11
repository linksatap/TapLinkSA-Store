/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image Optimization - Enhanced for mobile performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.taplinksa.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Cache images for 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable image optimization for better mobile performance
    unoptimized: false,
  },

  // Internationalization
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },

  // Compression
  compress: true,

  // Turbopack configuration for faster builds
  turbopack: {
    root: __dirname,
  },

  // Enhanced Headers for caching, security, and performance
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|bmp|tiff)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security and performance headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/product/:slug',
        destination: '/shop/:slug',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'تاب لينك السعودية',
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'axios', 'react-icons'],
    // Enable modern JavaScript for better performance
    modern: true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Production source maps (disable for security and performance)
  productionBrowserSourceMaps: false,

  // Trailing slash
  trailingSlash: false,

  // Powered by header (disable for security)
  poweredByHeader: false,

  // SWC minification for better performance
  swcMinify: true,

  // Output standalone for better deployment
  output: 'standalone',
};

module.exports = nextConfig;
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});