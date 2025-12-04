// pages/server-sitemap-categories.xml.js
/**
 * 📂 Categories Sitemap Generator
 * 
 * Professional sitemap for WooCommerce product categories
 * - Fetches all categories from WooCommerce REST API
 * - Supports Arabic category names with proper encoding
 * - Filters empty categories (count > 0)
 * - Includes lastmod, changefreq, priority
 * - Full error handling with fallback
 * - Optimized for Google Search Console
 * 
 * @author TapLinkSA Development Team
 * @version 2.0.0
 * @seo-optimized 2025
 */

import { getServerSideSitemap } from 'next-sitemap';

/**
 * Fetch all categories from WooCommerce API
 * @returns {Promise<Array>} Array of category objects
 */
async function fetchAllCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  // Validate environment variables
  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('❌ Missing WooCommerce credentials in environment variables');
    return [];
  }

  try {
    const url = `${baseUrl}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true&orderby=count&order=desc`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ WooCommerce API returned status ${response.status}`);
      return [];
    }

    const categories = await response.json();

    if (!Array.isArray(categories)) {
      console.warn('⚠️ Categories response is not an array');
      return [];
    }

    console.log(`✅ Successfully fetched ${categories.length} categories`);
    return categories;

  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    return [];
  }
}

/**
 * Generate sitemap fields for categories
 * @param {Array} categories - Array of WooCommerce categories
 * @param {string} siteUrl - Base site URL
 * @returns {Array} Sitemap fields array
 */
function generateCategoryFields(categories, siteUrl) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return [];
  }

  return categories
    .filter(category => {
      // Only include categories with products
      return category.slug && category.count > 0;
    })
    .map(category => {
      // Properly encode Arabic slugs
      const encodedSlug = encodeURIComponent(category.slug);
      
      // Categories don't have modification dates, use current date
      const lastmod = new Date().toISOString();

      // Higher priority for categories with more products
      let priority = 0.7;
      if (category.count > 50) {
        priority = 0.8;
      } else if (category.count > 20) {
        priority = 0.75;
      }

      return {
        loc: `${siteUrl}/shop/category/${encodedSlug}`,
        lastmod: lastmod,
        changefreq: 'weekly',
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
    // Fetch all categories
    const categories = await fetchAllCategories();

    // Generate sitemap fields
    const fields = generateCategoryFields(categories, siteUrl);

    // If no categories, return empty sitemap
    if (fields.length === 0) {
      console.warn('⚠️ No categories found, returning empty sitemap');
      return getServerSideSitemap(ctx, []);
    }

    // Set cache headers for better performance
    ctx.res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400');

    return getServerSideSitemap(ctx, fields);

  } catch (error) {
    console.error('❌ Fatal error in categories sitemap:', error.message);
    
    // Return empty sitemap instead of crashing
    return getServerSideSitemap(ctx, []);
  }
};

// Default export required by Next.js
export default function CategoriesSitemap() {
  // This component will never be rendered
  return null;
}
