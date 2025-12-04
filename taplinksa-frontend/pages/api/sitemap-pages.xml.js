// pages/api/sitemap-pages.xml.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('📄 Generating pages sitemap...');

    const pages = await fetchPages();
    const xml = buildPagesSitemap(pages);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (err) {
    console.error('❌ Sitemap Error:', err.message);
    res.status(500).send(errorSitemap());
  }
}

async function fetchPages() {
  try {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages`;
    
    const response = await axios.get(url, {
      params: {
        per_page: 100,
        status: 'publish',
        _fields: 'id,slug,modified_gmt'
      },
      timeout: 15000
    });

    console.log(`✅ Fetched ${response.data.length} pages`);
    return response.data;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

function buildPagesSitemap(pages) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const now = new Date().toISOString();

  const excludedSlugs = ['cart', 'checkout', 'my-account'];

  const urls = pages
    .filter(p => p.slug && !excludedSlugs.includes(p.slug))
    .map(page => {
      const slug = encodeURIComponent(page.slug);
      const lastmod = page.modified_gmt 
        ? new Date(page.modified_gmt).toISOString()
        : now;

      return `
  <url>
    <loc>${siteUrl}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
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
