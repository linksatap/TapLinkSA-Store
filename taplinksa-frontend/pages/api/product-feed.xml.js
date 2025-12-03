// pages/api/product-feed.xml.js
// Google Merchant Zero-Error Feed – Next.js Edition v7.0

import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("⚡ Generating Google Merchant Feed…");

    const products = await fetchProducts();

    const xml = products.length ? buildFeed(products) : emptyFeed();

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    res.setHeader("X-Robots-Tag", "noindex");

    return res.status(200).send(xml);

  } catch (e) {
    console.error("❌ Feed Error:", e);
    return res.status(200).send(errorFeed());
  }
}

/* ============================================
   1) Fetch Products + Categories
============================================ */
async function fetchProducts() {
  try {
    const [pRes, cRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`, {
        params: { per_page: 200, status: "publish" },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        timeout: 15000,
      }),
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }),
    ]);

    return pRes.data.map(p => ({
      ...p,
      fullCategories: cRes.data.filter(cat => p.categories?.some(c => c.id === cat.id)),
    }));

  } catch (e) {
    console.log("Fetch Failed:", e.message);
    return [];
  }
}

/* ============================================
   2) Build Main XML Feed
============================================ */
function buildFeed(products) {
  const now = new Date().toISOString();
  const siteUrl = "https://taplinksa.com";

  const items = products.map(p => buildItem(p, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA – NFC Cards Feed]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[NFC Cards • Digital Business Solutions]]></description>
    <lastBuildDate>${now}</lastBuildDate>

${items}

  </channel>
</rss>`;
}

/* ============================================
   3) Build Each Product Item
============================================ */
function buildItem(product, siteUrl) {
  const id = product.id;
  const sku = product.sku || `TAP-${id}`;
  const title = cleanAndSafe(product.name);
  const description = cleanAndSafe(product.short_description || product.description);

  const link = `${siteUrl}/product/${slug(product.slug)}?utm_source=google`;

  const mainImg = optimizeImg(product.images?.[0]?.src);
  const extraImgs = (product.images || [])
    .slice(1, 10)
    .map(i => `<g:additional_image_link>${optimizeImg(i.src)}</g:additional_image_link>`)
    .join("");

  const price = format(product.price);
  const sale = product.sale_price && product.sale_price < product.price
    ? `<g:sale_price>${format(product.sale_price)} SAR</g:sale_price>`
    : "";

  const googleCategory = detectCategory(product);
  const productType = (product.fullCategories || []).map(c => c.name).join(" > ") || "NFC";

  return `
    <item>
      <g:id>${id}</g:id>
      <g:sku>${xml(sku)}</g:sku>

      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>

      <g:link>${link}</g:link>
      <g:image_link>${mainImg}</g:image_link>
      ${extraImgs}

      <g:price>${price} SAR</g:price>
      ${sale}

      <g:availability>${product.stock_status === "instock" ? "in stock" : "out of stock"}</g:availability>
      <g:condition>new</g:condition>

      <g:brand><![CDATA[TapLink SA]]></g:brand>
      <g:identifier_exists>no</g:identifier_exists>

      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${cleanAndSafe(productType)}]]></g:product_type>

      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>25 SAR</g:price>
      </g:shipping>

      <g:tax>
        <g:country>SA</g:country>
        <g:rate>15</g:rate>
      </g:tax>
    </item>`;
}

/* ============================================
   4) Utility Functions – 100% Safe in Next.js
============================================ */

// 🔥 remove emoji WITHOUT unicode-range regex
function removeEmoji(str = "") {
  return str.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF])/g,
    ""
  );
}

// 🔥 clean HTML + spaces + emoji + entities safely
function cleanAndSafe(str = "") {
  return removeEmoji(
    str
      .replace(/<[^>]*>/g, "")     // remove HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&#[0-9]+;/g, "")
      .replace(/&#x[0-9A-F]+;/gi, "")
      .replace(/&(?!(amp;|lt;|gt;))/g, "&amp;")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

// Safe XML escaping for attribute fields
function xml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slug(str = "") {
  return str.replace(/[^\w\u0600-\u06FF-]/g, "");
}

function optimizeImg(src) {
  if (!src) return "https://taplinksa.com/placeholder.jpg";
  return src.split("?")[0] + "?w=1200&h=1200&fit=crop&quality=85";
}

function format(n) {
  return parseFloat(n || 0).toFixed(2);
}

function detectCategory(product) {
  const name = product.name?.toLowerCase() || "";
  if (name.includes("nfc") || name.includes("بطاقة")) return "3086"; // NFC Category
  return "922"; // Electronics Accessories
}

/* ============================================
   5) Backup Feeds
============================================ */
function emptyFeed() {
  return `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0">
  <channel><title>No Products</title></channel>
</rss>`;
}

function errorFeed() {
  return emptyFeed();
}
