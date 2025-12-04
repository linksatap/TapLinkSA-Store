// pages/server-sitemap-products.xml.js
/**
 * 🛍️ Products Sitemap Generator
 * 
 * Professional sitemap for WooCommerce products
 * - Fetches all products from WooCommerce REST API
 * - Supports Arabic slugs with proper encoding
 * - Handles pagination for 2000+ products
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
 * Fetch all products from WooCommerce API with pagination support
 * @returns {Promise<Array>} Array of product objects
 */
async function fetchAllProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  // Validate environment variables
  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('❌ Missing WooCommerce credentials in environment variables');
    return [];
  }

  let allProducts = [];
  let page = 1;
  let hasMore = true;
  const perPage = 100; // WooCommerce max per page

  try {
    while (hasMore) {
      const url = `${baseUrl}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&status=publish&orderby=modified&order=desc`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ WooCommerce API returned status ${response.status} for page ${page}`);
        break;
      }

      const products = await response.json();

      // Check if we got products
      if (!Array.isArray(products) || products.length === 0) {
        hasMore = false;
        break;
      }

      allProducts = [...allProducts, ...products];

      // Check if there are more pages
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      if (page >= totalPages) {
        hasMore = false;
      } else {
        page++;
      }

      // Safety limit to prevent infinite loops
      if (page > 100) {
        console.warn('⚠️ Reached maximum page limit (100 pages)');
        break;
      }
    }

    console.log(`✅ Successfully fetched ${allProducts.length} products`);
    return allProducts;

  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return [];
  }
}

/**
 * Generate sitemap fields for products
 * @param {Array} products - Array of WooCommerce products
 * @param {string} siteUrl - Base site URL
 * @returns {Array} Sitemap fields array
 */
function generateProductFields(products, siteUrl) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  return products
    .filter(product => product.slug && product.status === 'publish')
    .map(product => {
      // Properly encode Arabic slugs
      const encodedSlug = encodeURIComponent(product.slug);
      
      // Use product's last modified date or current date
      const lastmod = product.date_modified_gmt 
        ? new Date(product.date_modified_gmt).toISOString()
        : new Date().toISOString();

      return {
        loc: `${siteUrl}/shop/${encodedSlug}`,
        lastmod: lastmod,
        changefreq: 'weekly',
        priority: 0.9, // High priority for products
      };
    });
}

/**
 * Server-side props for Next.js
 */
export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  try {
    // Fetch all products
    const products = await fetchAllProducts();

    // Generate sitemap fields
    const fields = generateProductFields(products, siteUrl);

    // If no products, return minimal sitemap
    if (fields.length === 0) {
      console.warn('⚠️ No products found, returning empty sitemap');
      return getServerSideSitemap(ctx, []);
    }

    // Set cache headers for better performance
    ctx.res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    return getServerSideSitemap(ctx, fields);

  } catch (error) {
    console.error('❌ Fatal error in products sitemap:', error.message);
    
    // Return empty sitemap instead of crashing
    return getServerSideSitemap(ctx, []);
  }
};

// Default export required by Next.js
export default function ProductsSitemap() {
  // This component will never be rendered
  return null;
}
