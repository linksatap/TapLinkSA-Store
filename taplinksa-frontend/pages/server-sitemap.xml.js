// pages/server-sitemap.xml.js
// نسخة بديلة تستخدم دوال API موجودة في المشروع

import { getServerSideSitemap } from 'next-sitemap';
import { fetchProducts, fetchCategories } from '../lib/woocommerce'; // استخدم الدوال الموجودة في مشروعك

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const fields = [];

  try {
    // جلب المنتجات باستخدام الدوال الموجودة في lib/woocommerce.js
    const products = await fetchProducts({ per_page: 100 });
    
    if (products && Array.isArray(products)) {
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

    // جلب الفئات
    //const categories = await fetchCategories();
    
    //if (categories && Array.isArray(categories)) {
     // const categoryFields = categories
      //  .filter((category) => category.count > 0)
       // .map((category) => ({
       //   loc: `${siteUrl}/shop/category/${category.slug}`,
       //   lastmod: new Date().toISOString(),
       //   changefreq: 'weekly',
       //   priority: 0.7,
     //   }));
   //   fields.push(...categoryFields);
   // }

    // إذا كانت لديك مقالات، أضف هنا:
    // const posts = await fetchPosts();
    // if (posts && Array.isArray(posts)) {
    //   const postFields = posts.map((post) => ({
    //     loc: `${siteUrl}/blog/${post.slug}`,
    //     lastmod: post.modified_gmt 
    //       ? new Date(post.modified_gmt).toISOString() 
    //       : new Date().toISOString(),
    //     changefreq: 'monthly',
    //     priority: 0.6,
    //   }));
    //   fields.push(...postFields);
    // }

  } catch (error) {
    console.error('Error generating server sitemap:', error);
    // في حالة الخطأ، نرجع sitemap فارغ بدلاً من خطأ 500
  }

  // إذا لم يتم جلب أي بيانات، أضف على الأقل الصفحات الثابتة
  if (fields.length === 0) {
    fields.push({
      loc: `${siteUrl}/shop`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9,
    });
  }

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}
