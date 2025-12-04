// pages/server-sitemap-products.xml.js
import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';

async function fetchAllProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('❌ Missing WooCommerce credentials');
    return [];
  }

  let allProducts = [];
  let page = 1;
  let hasMore = true;
  const perPage = 100;

  try {
    while (hasMore) {
      const url = `${baseUrl}/wp-json/wc/v3/products`;
      
      // ✅ استخدام axios مع auth
      const response = await axios.get(url, {
        params: {
          per_page: perPage,
          page: page,
          status: 'publish',
          orderby: 'modified',
          order: 'desc'
        },
        auth: {
          username: consumerKey,
          password: consumerSecret
        },
        timeout: 15000
      });

      const products = response.data;

      if (!Array.isArray(products) || products.length === 0) {
        hasMore = false;
        break;
      }

      allProducts = [...allProducts, ...products];

      // Check pagination
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      if (page >= totalPages) {
        hasMore = false;
      } else {
        page++;
      }

      if (page > 100) {
        console.warn('⚠️ Reached maximum page limit');
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

function generateProductFields(products, siteUrl) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  return products
    .filter(product => product.slug && product.status === 'publish')
    .map(product => {
      const encodedSlug = encodeURIComponent(product.slug);
      const lastmod = product.date_modified_gmt
        ? new Date(product.date_modified_gmt).toISOString()
        : new Date().toISOString();

      return {
        loc: `${siteUrl}/shop/${encodedSlug}`,
        lastmod: lastmod,
        changefreq: 'weekly',
        priority: 0.9,
      };
    });
}

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  try {
    const products = await fetchAllProducts();
    const fields = generateProductFields(products, siteUrl);

    if (fields.length === 0) {
      console.warn('⚠️ No products found');
      return getServerSideSitemap(ctx, []);
    }

    ctx.res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return getServerSideSitemap(ctx, fields);

  } catch (error) {
    console.error('❌ Fatal error in products sitemap:', error.message);
    return getServerSideSitemap(ctx, []);
  }
};

export default function ProductsSitemap() {
  return null;
}
