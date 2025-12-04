// pages/server-sitemap-posts.xml.js
/**
 * 📝 Blog Posts Sitemap Generator
 * 
 * Professional sitemap for WordPress blog posts
 * - Fetches all published posts from WordPress REST API
 * - Supports Arabic post slugs with proper encoding
 * - Handles pagination for 2000+ posts
 * - Uses modified_gmt for accurate lastmod
 * - Includes changefreq, priority based on post age
 * - Full error handling with fallback
 * - Optimized for Google Search Console
 * 
 * @author TapLinkSA Development Team
 * @version 2.0.0
 * @seo-optimized 2025
 */

import { getServerSideSitemap } from 'next-sitemap';

/**
 * Fetch all posts from WordPress API with pagination support
 * @returns {Promise<Array>} Array of post objects
 */
async function fetchAllPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  // Validate environment variable
  if (!baseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_WORDPRESS_URL in environment variables');
    return [];
  }

  let allPosts = [];
  let page = 1;
  let hasMore = true;
  const perPage = 100; // WordPress max per page

  try {
    while (hasMore) {
      const url = `${baseUrl}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&status=publish&orderby=modified&order=desc&_fields=id,slug,modified_gmt,date_gmt`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ WordPress API returned status ${response.status} for page ${page}`);
        break;
      }

      const posts = await response.json();

      // Check if we got posts
      if (!Array.isArray(posts) || posts.length === 0) {
        hasMore = false;
        break;
      }

      allPosts = [...allPosts, ...posts];

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

    console.log(`✅ Successfully fetched ${allPosts.length} posts`);
    return allPosts;

  } catch (error) {
    console.error('❌ Error fetching posts:', error.message);
    return [];
  }
}

/**
 * Calculate priority based on post age
 * @param {string} dateGmt - Post publication date in GMT
 * @returns {number} Priority value between 0.5 and 0.7
 */
function calculatePostPriority(dateGmt) {
  if (!dateGmt) return 0.6;

  const postDate = new Date(dateGmt);
  const now = new Date();
  const daysSincePublished = (now - postDate) / (1000 * 60 * 60 * 24);

  // Recent posts get higher priority
  if (daysSincePublished < 30) return 0.7;
  if (daysSincePublished < 90) return 0.65;
  if (daysSincePublished < 180) return 0.6;
  return 0.55;
}

/**
 * Calculate changefreq based on post age
 * @param {string} dateGmt - Post publication date in GMT
 * @returns {string} Change frequency value
 */
function calculateChangefreq(dateGmt) {
  if (!dateGmt) return 'monthly';

  const postDate = new Date(dateGmt);
  const now = new Date();
  const daysSincePublished = (now - postDate) / (1000 * 60 * 60 * 24);

  // Recent posts change more frequently
  if (daysSincePublished < 7) return 'daily';
  if (daysSincePublished < 30) return 'weekly';
  if (daysSincePublished < 90) return 'monthly';
  return 'yearly';
}

/**
 * Generate sitemap fields for posts
 * @param {Array} posts - Array of WordPress posts
 * @param {string} siteUrl - Base site URL
 * @returns {Array} Sitemap fields array
 */
function generatePostFields(posts, siteUrl) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  return posts
    .filter(post => post.slug)
    .map(post => {
      // Properly encode Arabic slugs
      const encodedSlug = encodeURIComponent(post.slug);
      
      // Use post's last modified date
      const lastmod = post.modified_gmt 
        ? new Date(post.modified_gmt).toISOString()
        : new Date().toISOString();

      // Calculate dynamic priority and changefreq
      const priority = calculatePostPriority(post.date_gmt);
      const changefreq = calculateChangefreq(post.date_gmt);

      return {
        loc: `${siteUrl}/blog/${encodedSlug}`,
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
    // Fetch all posts
    const posts = await fetchAllPosts();

    // Generate sitemap fields
    const fields = generatePostFields(posts, siteUrl);

    // If no posts, return empty sitemap
    if (fields.length === 0) {
      console.warn('⚠️ No posts found, returning empty sitemap');
      return getServerSideSitemap(ctx, []);
    }

    // Set cache headers for better performance
    ctx.res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    return getServerSideSitemap(ctx, fields);

  } catch (error) {
    console.error('❌ Fatal error in posts sitemap:', error.message);
    
    // Return empty sitemap instead of crashing
    return getServerSideSitemap(ctx, []);
  }
};

// Default export required by Next.js
export default function PostsSitemap() {
  // This component will never be rendered
  return null;
}
