// pages/api/sitemap-products.xml.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('🛍️ Generating products sitemap...');

    const products = await fetchProducts();
    const xml = buildProductsSitemap(products);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (err) {
    console.error('❌ Sitemap Error:', err.message);
    res.status(500).send(errorSitemap());
  }
}

async function fetchProducts() {
  try {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`;
    
    const response = await axios.get(url, {
      params: {
        per_page: 100,
        status: 'publish'
      },
      auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET
      },
      timeout: 15000
    });

    console.log(`✅ Fetched ${response.data.length} products`);
    return response.data;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

function buildProductsSitemap(products) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const now = new Date().toISOString();

  const urls = products
    .filter(p => p.slug)
    .map(product => {
      const slug = encodeURIComponent(product.slug);
      const lastmod = product.date_modified_gmt 
        ? new Date(product.date_modified_gmt).toISOString()
        : now;

      return `
  <url>
    <loc>${siteUrl}/shop/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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
