// pages/api/sitemap-pages.xml.js

export default async function handler(req, res) {
  try {
    console.log('📄 Generating Next.js pages sitemap...');

    const pages = getNextJsPages();
    const xml = buildPagesSitemap(pages);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (err) {
    console.error('❌ Sitemap Error:', err.message);
    res.status(500).send(errorSitemap());
  }
}

// ✅ صفحات Next.js فقط
function getNextJsPages() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const now = new Date().toISOString();

  return [
    {
      loc: `${siteUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${siteUrl}/shop`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${siteUrl}/subscriptions`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${siteUrl}/coupons`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${siteUrl}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${siteUrl}/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${siteUrl}/blog`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${siteUrl}/services`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${siteUrl}/privacy-policy`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.5
    },
    {
      loc: `${siteUrl}/terms`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.5
    },
    // ✅ أضف صفحاتك الأخرى هنا
  ];
}

function buildPagesSitemap(pages) {
  const urls = pages
    .map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
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
