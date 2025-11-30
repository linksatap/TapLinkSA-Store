// Dynamic Sitemap Generation API
// This generates sitemap.xml dynamically including products and blog posts

export default async function handler(req, res) {
  try {
    // Base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
    const currentDate = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/shop', changefreq: 'daily', priority: '0.9' },
      { url: '/blog', changefreq: 'weekly', priority: '0.8' },
      { url: '/about', changefreq: 'monthly', priority: '0.7' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/services', changefreq: 'monthly', priority: '0.7' },
      { url: '/faq', changefreq: 'monthly', priority: '0.6' },
      { url: '/subscriptions', changefreq: 'weekly', priority: '0.8' },
      { url: '/coupons', changefreq: 'weekly', priority: '0.7' },
      { url: '/privacy-policy', changefreq: 'yearly', priority: '0.4' },
      { url: '/terms', changefreq: 'yearly', priority: '0.4' },
    ];

    // TODO: Fetch dynamic products from your API/CMS
    // Example:
    // const productsRes = await fetch(`${baseUrl}/api/products`);
    // const products = await productsRes.json();
    const products = []; // Replace with actual product data

    // TODO: Fetch dynamic blog posts from your API/CMS
    // Example:
    // const blogRes = await fetch(`${baseUrl}/api/blog`);
    // const blogPosts = await blogRes.json();
    const blogPosts = []; // Replace with actual blog data

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Add static pages
    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add dynamic products
    products.forEach(product => {
      xml += `
  <url>
    <loc>${baseUrl}/shop/${product.slug}</loc>
    <lastmod>${product.updatedAt || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add dynamic blog posts
    blogPosts.forEach(post => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    // Set headers
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    // Send response
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
