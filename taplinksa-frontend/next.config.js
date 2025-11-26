/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cms.smartshopperz.com'],
    formats: ['image/avif', 'image/webp'],
  },
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
}

module.exports = nextConfig
