// pages/server-sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap';
import { getProducts, getCategories, getPosts } from '../lib/api'; // افترض وجود هذه الدوال

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  // جلب المنتجات
  const products = await getProducts({ per_page: 100 } );
  const productFields = products.map((product) => ({
    loc: `${siteUrl}/shop/${product.slug}`,
    lastmod: product.date_modified_gmt || new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));

  // جلب الفئات
  const categories = await getCategories();
  const categoryFields = categories.map((category) => ({
    loc: `${siteUrl}/shop?category=${category.id}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.7,
  }));

 //  جلب المدونات (إذا وجدت)
  const posts = await getPosts();
  const postFields = posts.map((post) => ({
     loc: `${siteUrl}/blog/${post.slug}`,
     lastmod: post.modified_gmt || new Date().toISOString(),
     changefreq: 'monthly',
   priority: 0.6,
   }));

  const fields = [...productFields, ...categoryFields];

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}