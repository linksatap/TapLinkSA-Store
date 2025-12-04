/**
 * 🗺️ Next.js Sitemap Configuration
 * 
 * Professional sitemap configuration for TapLinkSA
 * - Combines all dynamic sitemaps (products, categories, posts, pages)
 * - Generates static sitemap for Next.js pages
 * - Optimized for Google Search Console
 * - Full support for Arabic content
 * - Scalable architecture for large sites
 * 
 * @author TapLinkSA Development Team
 * @version 2.0.0
 * @seo-optimized 2025
 * 
 * Installation:
 * npm install next-sitemap
 * 
 * Usage:
 * Add to package.json scripts:
 * "postbuild": "next-sitemap"
 */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Base URL of your site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com',

  // Generate robots.txt file
  generateRobotsTxt: true,

  // Generate index sitemap
  generateIndexSitemap: true,

  // Sitemap size (max URLs per sitemap file)
  sitemapSize: 5000,

  // Change frequency for static pages
  changefreq: 'daily',

  // Default priority for static pages
  priority: 0.7,

  // Exclude these paths from static sitemap
  exclude: [
    '/server-sitemap-products.xml',
    '/server-sitemap-categories.xml',
    '/server-sitemap-posts.xml',
    '/server-sitemap-pages.xml',
    '/api/*',
    '/admin/*',
    '/404',
    '/500',
    '/_error',
    '/_document',
    '/_app',
    '/ar/404',
    '/ar/500',
  ],

  // Additional sitemaps (dynamic server-side sitemaps)
  additionalSitemaps: [
    'https://taplinksa.com/server-sitemap-products.xml',
    'https://taplinksa.com/server-sitemap-categories.xml',
    'https://taplinksa.com/server-sitemap-posts.xml',
    'https://taplinksa.com/server-sitemap-pages.xml',
  ],

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/cart/',
          '/checkout/',
          '/my-account/',
          '/wp-admin/',
          '/wp-login.php',
          '/*?s=',
          '/*&s=',
          '/search/',
          '/*?add-to-cart=',
          '/*?removed_item=',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://taplinksa.com/server-sitemap-products.xml',
      'https://taplinksa.com/server-sitemap-categories.xml',
      'https://taplinksa.com/server-sitemap-posts.xml',
      'https://taplinksa.com/server-sitemap-pages.xml',
    ],
  },

  // Transform function to customize URLs
  transform: async (config, path) => {
    // Custom priority for specific routes
    const customPriorities = {
      '/': 1.0,
      '/shop': 0.95,
      '/coupons': 0.9,
      '/services': 0.85,
      '/about': 0.8,
      '/contact': 0.75,
    };

    // Custom changefreq for specific routes
    const customChangefreq = {
      '/': 'daily',
      '/shop': 'daily',
      '/coupons': 'weekly',
      '/services': 'monthly',
      '/about': 'monthly',
      '/contact': 'monthly',
    };

    return {
      loc: path,
      changefreq: customChangefreq[path] || config.changefreq,
      priority: customPriorities[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  // Additional paths to include in static sitemap
  additionalPaths: async (config) => {
    const result = [];

    // Add homepage with highest priority
    result.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    // Add main sections
    const mainSections = [
      { path: '/shop', priority: 0.95, changefreq: 'daily' },
      { path: '/coupons', priority: 0.9, changefreq: 'weekly' },
      { path: '/services', priority: 0.85, changefreq: 'monthly' },
      { path: '/about', priority: 0.8, changefreq: 'monthly' },
      { path: '/contact', priority: 0.75, changefreq: 'monthly' },
      { path: '/faq', priority: 0.7, changefreq: 'monthly' },
    ];

    mainSections.forEach((section) => {
      result.push({
        loc: section.path,
        changefreq: section.changefreq,
        priority: section.priority,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },

  // Output directory
  outDir: './public',
};
