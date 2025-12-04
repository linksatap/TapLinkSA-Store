// pages/api/sitemap-posts.xml.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('📝 Generating posts sitemap...');

    const posts = await fetchPosts();
    const xml = buildPostsSitemap(posts);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (err) {
    console.error('❌ Sitemap Error:', err.message);
    res.status(500).send(errorSitemap());
  }
}

async function fetchPosts() {
  try {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts`;
    
    const response = await axios.get(url, {
      params: {
        per_page: 100,
        status: 'publish',
        _fields: 'id,slug,modified_gmt'
      },
      timeout: 15000
    });

    console.log(`✅ Fetched ${response.data.length} posts`);
    return response.data;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

function buildPostsSitemap(posts) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const now = new Date().toISOString();

  const urls = posts
    .filter(p => p.slug)
    .map(post => {
      const slug = encodeURIComponent(post.slug);
      const lastmod = post.modified_gmt 
        ? new Date(post.modified_gmt).toISOString()
        : now;

      return `
  <url>
    <loc>${siteUrl}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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
