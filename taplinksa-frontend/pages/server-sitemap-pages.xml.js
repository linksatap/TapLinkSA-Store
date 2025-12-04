// pages/server-sitemap-pages.xml.js
/**
 * 📄 WordPress Pages Sitemap Generator
 * 
 * Professional sitemap for WordPress static pages
 * - Fetches all published pages from WordPress REST API
 * - Supports Arabic and English page slugs
 * - Priority based on page importance
 * - Uses modified_gmt for accurate lastmod
 * - Excludes system pages (cart, checkout, etc.)
 * - Full error handling with fallback
 * - Optimized for Google Search Console
 * 
 * @author TapLinkSA Development Team
 * @version 2.0.0
 * @seo-optimized 2025
 */

import { getServerSideSitemap } from 'next-sitemap';

/**
 * Pages to exclude from sitemap (system pages, private pages, etc.)
 */
const EXCLUDED_SLUGS = [
  'cart',
  'checkout',
  'my-account',
  'my-orders',
  'profile',
  'login',
  'register',
  'thank-you',
  'privacy-policy-draft',
  'sample-page',
];

/**
 * Priority mapping for important pages
 */
const PAGE_PRIORITIES = {
  'home': 1.0,
  'about': 0.9,
  'about-us': 0.9,
  'من-نحن': 0.9,
  'services': 0.9,
  'الخدمات': 0.9,
  'contact': 0.8,
  'اتصل-بنا': 0.8,
  'faq': 0.7,
  'الأسئلة-الشائعة': 0.7,
  'privacy-policy': 0.6,
  'سياسة-الخصوصية': 0.6,
  'terms': 0.6,
  'الشروط-والأحكام': 0.6,
};

/**
 * Fetch all pages from WordPress API
 * @returns {Promise<Array>} Array of page objects
 */
async function fetchAllPages() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  // Validate environment variable
  if (!baseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_WORDPRESS_URL in environment variables');
    return [];
  }

  try {
    const url = `${baseUrl}/wp-json/wp/v2/pages?per_page=100&status=publish&orderby=menu_order&order=asc&_fields=id,slug,modified_gmt,parent`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ WordPress API returned status ${response.status}`);
      return [];
    }

    const pages = await response.json();

    if (!Array.isArray(pages)) {
      console.warn('⚠️ Pages response is not an array');
      return [];
    }

    console.log(`✅ Successfully fetched ${pages.length} pages`);
    return pages;

  } catch (error) {
    console.error('❌ Error fetching pages:', error.message);
    return [];
  }
}

/**
 * Get priority for a page based on its slug
 * @param {string} slug - Page slug
 * @returns {number} Priority value
 */
function getPagePriority(slug) {
  // Check if slug has custom priority
  if (PAGE_PRIORITIES[slug]) {
    return PAGE_PRIORITIES[slug];
  }

  // Default priority for other pages
  return 0.7;
}

/**
 * Generate sitemap fields for pages
 * @param {Array} pages - Array of WordPress pages
 * @param {string} siteUrl - Base site URL
 * @returns {Array} Sitemap fields array
 */
function generatePageFields(pages, siteUrl) {
  if (!Array.isArray(pages) || pages.length === 0) {
    return [];
  }

  return pages
    .filter(page => {
      // Exclude system pages and pages without slug
      return page.slug && !EXCLUDED_SLUGS.includes(page.slug);
    })
    .map(page => {
      // Properly encode Arabic slugs
      const encodedSlug = encodeURIComponent(page.slug);
      
      // Use page's last modified date
      const lastmod = page.modified_gmt 
        ? new Date(page.modified_gmt).toISOString()
        : new Date().toISOString();

      // Get priority based on page importance
      const priority = getPagePriority(page.slug);

      // Pages change less frequently than posts
      const changefreq = priority >= 0.9 ? 'weekly' : 'monthly';

      return {
        loc: `${siteUrl}/${encodedSlug}`,
        lastmod: lastmod,
        changefreq: changefreq,
        priority: priority,
      };
    });
}

/**
 * Server-side props for Next.js
 */
export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  try {
    // Fetch all pages
    const pages = await fetchAllPages();

    // Generate sitemap fields
    const fields = generatePageFields(pages, siteUrl);

    // If no pages, return empty sitemap
    if (fields.length === 0) {
      console.warn('⚠️ No pages found, returning empty sitemap');
      return getServerSideSitemap(ctx, []);
    }

    // Set cache headers for better performance
    ctx.res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400');

    return getServerSideSitemap(ctx, fields);

  } catch (error) {
    console.error('❌ Fatal error in pages sitemap:', error.message);
    
    // Return empty sitemap instead of crashing
    return getServerSideSitemap(ctx, []);
  }
};

// Default export required by Next.js
export default function PagesSitemap() {
  // This component will never be rendered
  return null;
}
