// pages/server-sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const fields = [];

  try {
    // جلب المنتجات من WooCommerce API
    const productsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?per_page=100&consumer_key=${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
    );

    if (productsResponse.ok) {
      const products = await productsResponse.json();
      const productFields = products.map((product) => ({
        loc: `${siteUrl}/shop/${product.slug}`,
        lastmod: product.date_modified_gmt 
          ? new Date(product.date_modified_gmt).toISOString() 
          : new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      }));
      fields.push(...productFields);
    }

    // جلب الفئات من WooCommerce API
    const categoriesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
    );

    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      const categoryFields = categories
        .filter((category) => category.count > 0) // فقط الفئات التي تحتوي على منتجات
        .map((category) => ({
          loc: `${siteUrl}/shop/category/${category.slug}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        }));
      fields.push(...categoryFields);
    }

    // جلب المقالات من WordPress API (إذا كانت المدونة موجودة)
    const postsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wp/v2/posts?per_page=100`
    );

    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      const postFields = posts.map((post) => ({
        loc: `${siteUrl}/blog/${post.slug}`,
        lastmod: post.modified_gmt 
          ? new Date(post.modified_gmt).toISOString() 
          : new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
      }));
      fields.push(...postFields);
    }

  } catch (error) {
    console.error('Error generating server sitemap:', error);
    // في حالة الخطأ، نرجع sitemap فارغ بدلاً من خطأ 500
  }

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}
