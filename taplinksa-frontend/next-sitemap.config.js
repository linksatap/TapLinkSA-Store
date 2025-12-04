// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com',
  generateRobotsTxt: true, // (Optional ) سيقوم بإنشاء ملف robots.txt تلقائياً
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
      { userAgent: '*', disallow: '/cart' },
      { userAgent: '*', disallow: '/checkout' },
      { userAgent: '*', disallow: '/my-orders' },
      { userAgent: '*', disallow: '/profile' },
      { userAgent: '*', disallow: '/login' },
      { userAgent: '*', disallow: '/register' },
      { userAgent: '*', disallow: '/thank-you' },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`,
    ],
  },
  // استبعاد الصفحات التي لا نريدها في الخريطة
  exclude: ['/api/*', '/cart', '/checkout', '/my-orders', '/profile', '/login', '/register', '/thank-you', '/server-sitemap.xml'],
  // فك تشفير الروابط العربية
  transform: async (config, path) => {
    return {
      loc: decodeURI(path), // استخدام decodeURI لضمان روابط مقروءة
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
};