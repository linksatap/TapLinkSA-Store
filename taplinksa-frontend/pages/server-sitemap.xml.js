import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taplinksa.com";
  const wp = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  let products = [];

  try {
    const res = await axios.get(`${wp}/wp-json/wc/v3/products`, {
      auth: { username: key, password: secret },
      params: { per_page: 100, status: "publish" }
    });

    // تأكد أنها Array
    products = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error("Error fetching products:", e.message);
    products = [];
  }

  const productFields = products.map((p) => ({
    loc: `${siteUrl}/product/${encodeURIComponent(p.slug)}`,
    lastmod: p.date_modified_gmt || new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.9
  }));

  const staticFields = [
    { loc: siteUrl, changefreq: "daily", priority: 1.0 },
    { loc: `${siteUrl}/shop`, changefreq: "daily", priority: 0.9 },
  ];

  const fields = [
    ...staticFields,
    ...productFields
  ];

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}
