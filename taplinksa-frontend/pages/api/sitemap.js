// pages/sitemap.xml.js
import axios from 'axios';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://cms.taplinksa.com';

function formatDate(dateString) {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function generateSitemapXML({ staticPages, products, posts }) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // الصفحات الثابتة (Landing / متجر / صفحات مهمة)
  staticPages.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // المنتجات (نفترض أن صفحة المنتج في Next هي /product/[slug])
  products.forEach((product) => {
    const lastmod =
      product.date_modified || product.date_created || new Date().toISOString();
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/product/${product.slug}</loc>\n`;
    xml += `    <lastmod>${formatDate(lastmod)}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    xml += `  </url>\n`;
  });

  // المقالات (نفترض أن صفحة المقال في Next هي /blog/[slug])
  posts.forEach((post) => {
    const lastmod = post.modified || post.date || new Date().toISOString();
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${formatDate(lastmod)}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.60</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

export async function getServerSideProps({ res }) {
  try {
    // 1) تعريف الصفحات الثابتة المهمة
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { path: '/', changefreq: 'daily', priority: '1.00', lastmod: today },
      { path: '/shop', changefreq: 'daily', priority: '0.90', lastmod: today },
      { path: '/coupons', changefreq: 'weekly', priority: '0.80', lastmod: today },
      { path: '/subscriptions', changefreq: 'weekly', priority: '0.80', lastmod: today },
      { path: '/services', changefreq: 'monthly', priority: '0.70', lastmod: today },
      { path: '/about', changefreq: 'monthly', priority: '0.60', lastmod: today },
      { path: '/contact', changefreq: 'monthly', priority: '0.60', lastmod: today },
      { path: '/faq', changefreq: 'monthly', priority: '0.50', lastmod: today },
      { path: '/privacy-policy', changefreq: 'yearly', priority: '0.40', lastmod: today },
      { path: '/terms', changefreq: 'yearly', priority: '0.40', lastmod: today },
    ];

    // 2) جلب المنتجات من WooCommerce
    let products = [];
    try {
      const productsRes = await axios.get(
        `${WP_URL}/wp-json/wc/v3/products`,
        {
          params: {
            consumer_key: process.env.WC_CONSUMER_KEY,
            consumer_secret: process.env.WC_CONSUMER_SECRET,
            status: 'publish',
            per_page: 100,
            orderby: 'modified',
            order: 'desc',
          },
          timeout: 10000,
        }
      );
      products = Array.isArray(productsRes.data) ? productsRes.data : [];
    } catch (err) {
      console.warn('⚠️ Failed to fetch products for sitemap:', err.message);
      products = [];
    }

    // 3) جلب المقالات من ووردبريس
    let posts = [];
    try {
      const postsRes = await axios.get(
        `${WP_URL}/wp-json/wp/v2/posts`,
        {
          params: {
            status: 'publish',
            per_page: 100,
            order: 'desc',
            orderby: 'modified',
          },
          timeout: 10000,
        }
      );
      posts = Array.isArray(postsRes.data) ? postsRes.data : [];
    } catch (err) {
      console.warn('⚠️ Failed to fetch posts for sitemap:', err.message);
      posts = [];
    }

    // 4) توليد XML
    const xml = generateSitemapXML({ staticPages, products, posts });

    // 5) إرسال الرد
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    res.write(xml);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('❌ Error generating sitemap.xml:', error.message);

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.write(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
    );
    res.end();

    return { props: {} };
  }
}

export default function Sitemap() {
  // هذا الكومبوننت لا يُعرض، فقط مطلوب من Next
  return null;
}
