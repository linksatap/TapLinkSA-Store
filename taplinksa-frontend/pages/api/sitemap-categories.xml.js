// pages/api/sitemap-categories.xml.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('📂 Generating categories sitemap...');

    const categories = await fetchCategories();
    const xml = buildCategoriesSitemap(categories);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (err) {
    console.error('❌ Sitemap Error:', err.message);
    res.status(500).send(errorSitemap());
  }
}

async function fetchCategories() {
  try {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products/categories`;
    
    const response = await axios.get(url, {
      params: {
        per_page: 100,
        hide_empty: true
      },
      auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET
      },
      timeout: 15000
    });

    console.log(`✅ Fetched ${response.data.length} categories`);
    return response.data;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

function buildCategoriesSitemap(categories) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const now = new Date().toISOString();

  const urls = categories
    .filter(c => c.slug && c.count > 0)
    .map(category => {
      const slug = encodeURIComponent(category.slug);

      return `
  <url>
    <loc>${siteUrl}/shop/category/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function errorSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
}
