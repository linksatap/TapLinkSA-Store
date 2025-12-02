// pages/sitemap.xml.js
import axios from "axios";

async function fetchAllProducts() {
  let page = 1;
  let all = [];

  while (true) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/products`,
      {
        params: { per_page: 100, page },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    if (res.data.length === 0) break;

    all = [...all, ...res.data];
    page++;
  }

  return all;
}

function generateSiteMap(products) {
  const baseUrl = "https://taplinksa.com";

  const staticPages = [
    { loc: "/", freq: "daily", priority: "1.0" },
    { loc: "/shop", freq: "weekly", priority: "0.9" },
    { loc: "/services", freq: "weekly", priority: "0.8" },
    { loc: "/subscriptions", freq: "weekly", priority: "0.8" },
    { loc: "/about", freq: "monthly", priority: "0.7" },
    { loc: "/contact", freq: "monthly", priority: "0.7" },
    { loc: "/faq", freq: "monthly", priority: "0.6" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  ${staticPages
    .map(
      (p) => `
  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
  `
    )
    .join("")}

  ${products
    .map(
      (product) => `
  <url>
    <loc>${baseUrl}/shop/${product.slug}</loc>
    <lastmod>${product.date_modified_gmt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `
    )
    .join("")}

</urlset>`;
}

export async function getServerSideProps({ res }) {
  const allProducts = await fetchAllProducts();

  const sitemap = generateSiteMap(allProducts);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  return null;
}
