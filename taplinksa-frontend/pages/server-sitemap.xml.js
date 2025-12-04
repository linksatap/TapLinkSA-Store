// pages/server-sitemap.xml.js
// نسخة محسّنة مع معالجة كاملة للأخطاء

import { getServerSideSitemap } from 'next-sitemap';
import { getProducts } from '../lib/api';

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  let fields = [];

  try {
    // جلب المنتجات مع معالجة الأخطاء
    const products = await getProducts({ per_page: 100 });
    
    // التحقق من أن products هو array قبل استخدام map
    if (products && Array.isArray(products) && products.length > 0) {
      const productFields = products.map((product) => ({
        loc: `${siteUrl}/shop/${product.slug}`,
        lastmod: product.date_modified_gmt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      }));
      
      fields = [...productFields];
    } else {
      console.warn('No products returned or products is not an array');
    }

  } catch (error) {
    console.error('Error fetching products for sitemap:', error.message);
    
    // في حالة الخطأ، نضيف صفحات ثابتة على الأقل
    fields = [
      {
        loc: `${siteUrl}/shop`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${siteUrl}/coupons`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${siteUrl}/services`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      },
    ];
  }

  // التأكد النهائي من أن fields هو array وليس فارغاً
  if (!Array.isArray(fields) || fields.length === 0) {
    fields = [
      {
        loc: `${siteUrl}/shop`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
    ];
  }

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}
