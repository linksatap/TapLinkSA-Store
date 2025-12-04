// pages/server-sitemap-products.xml.js

/**
 * Products Sitemap Generator - WooCommerce
 * Generates XML sitemap for all products
 * URL: https://taplinksa.com/server-sitemap-products.xml
 */

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

  try {
    while (hasMore && page <= 100) {
      const url = `${baseUrl}/wp-json/wc/v3/products?per_page=100&page=${page}&status=publish&orderby=modified&order=desc`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
        },
      });

      if (!response.ok) break;

      const products = await response.json();
      if (!Array.isArray(products) || products.length === 0) break;

      allProducts = [...allProducts, ...products];
      
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      hasMore = page < totalPages;
      page++;
    }

    console.log(`✅ Fetched ${allProducts.length} products`);
    return allProducts;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return [];
  }
}

function generateSitemapXML(products, siteUrl) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  products.forEach((product) => {
    if (product.slug && product.status === 'publish') {
      const encodedSlug = encodeURIComponent(product.slug);
      const lastmod = product.date_modified_gmt
        ? new Date(product.date_modified_gmt).toISOString()
        : new Date().toISOString();

      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/shop/${encodedSlug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.9</priority>\n';
      xml += '  </url>\n';
    }
  });

  xml += '</urlset>';
  return xml;
}

export default async function ProductsSitemap(req, res) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  try {
    const products = await fetchAllProducts();
    const xml = generateSitemapXML(products, siteUrl);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.write(xml);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).end('Error generating sitemap');
  }
}
