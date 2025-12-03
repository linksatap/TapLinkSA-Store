// pages/api/product-feed.xml.js
// Google Merchant • Zero Error • Clean XML v6.0

import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("🚀 Generating Error-Free Google Merchant Feed…");

    const products = await fetchProducts();

    const xml = products.length
      ? buildFeed(products)
      : emptyFeed();

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    res.setHeader("X-Robots-Tag", "noindex");

    return res.status(200).send(xml);

  } catch (err) {
    console.error("❌ Feed Error:", err);
    return res.status(200).send(errorFeed());
  }
}

/*===============================================
  1) Fetch WooCommerce Products & Categories
================================================*/
async function fetchProducts() {
  try {
    const [pRes, cRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`, {
        params: {
          per_page: 150,
          status: "publish",
          stock_status: "instock",
        },
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
      })
    ]);

    return pRes.data.map(p => ({
      ...p,
      fullCategories: cRes.data.filter(cat =>
        p.categories?.some(c => c.id === cat.id)
      )
    }));

  } catch (e) {
    console.log("Fetch Failed:", e.message);
    return [];
  }
}

/*===============================================
  2) Build XML Feed
================================================*/
function buildFeed(products) {
  const now = new Date().toISOString();
  const siteUrl = "https://taplinksa.com";

  const items = products.map(p => buildItem(p, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA – NFC Cards]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[High-quality NFC Cards • Google Business Solutions]]></description>
    <lastBuildDate>${now}</lastBuildDate>

${items}

  </channel>
</rss>`;
}

/*===============================================
  3) Build <item> Element
================================================*/
function buildItem(product, siteUrl) {
  const id = product.id;
  const sku = product.sku || `TAP-${id}`;

  const title = cleanText(product.name);
  const description = cleanText(product.short_description || product.description);

  const link = `${siteUrl}/product/${cleanSlug(product.slug)}?utm_source=google`;

  const img = optimizeImg(product.images?.[0]?.src);
  const extra = (product.images || [])
    .slice(1, 10)
    .map(i => `<g:additional_image_link>${optimizeImg(i.src)}</g:additional_image_link>`)
    .join("");

  const price = format(product.price);
  const sale = product.sale_price && product.sale_price < product.price
    ? `<g:sale_price>${format(product.sale_price)} SAR</g:sale_price>`
    : "";

  const cat = detectCategory(product);
  const pType = (product.fullCategories || []).map(c => c.name).join(" > ") || "NFC";

  return `
    <item>
      <g:id>${id}</g:id>

      <g:title><![CDATA[${sanitize(title)}]]></g:title>
      <g:description><![CDATA[${sanitize(description)}]]></g:description>

      <g:link>${link}</g:link>
      <g:image_link>${img}</g:image_link>
      ${extra}

      <g:price>${price} SAR</g:price>
      ${sale}

      <g:availability>${product.stock_status === "instock" ? "in stock" : "out of stock"}</g:availability>
      <g:condition>new</g:condition>

      <g:brand><![CDATA[TapLink SA]]></g:brand>
      <g:identifier_exists>no</g:identifier_exists>

      <g:google_product_category>${cat}</g:google_product_category>
      <g:product_type><![CDATA[${sanitize(pType)}]]></g:product_type>

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

/*===============================================
  4) Utilities (Critical for Zero XML Errors)
================================================*/

// 🚫 يمنع الإيموجي + الرموز غير المدعومة
function removeEmoji(str = "") {
  return str.replace(/[\u{1F600}-\u{1F64F}]/gu, "")
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
            .replace(/[\u{2600}-\u{27BF}]/gu, "");
}

// 🧼 تنظيف النص بالكامل
function cleanText(str = "") {
  return removeEmoji(
    str
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

// 🤝 آمن بنسبة 100% داخل CDATA
function sanitize(str = "") {
  return String(str)
    .replace(/&(?!(amp;|lt;|gt;))/g, "&amp;") // إصلاح علامة &
    .replace(/]]>/g, "]]&gt;")
    .trim();
}

// 🔧 تنظيف السلاج
function cleanSlug(slug = "") {
  return slug.replace(/[^\w\u0600-\u06FF-]/g, "");
}

function optimizeImg(src) {
  if (!src) return "https://taplinksa.com/default.jpg";
  return src.split("?")[0] + "?w=1200&h=1200&fit=crop&quality=85";
}

function format(v) {
  return parseFloat(v || 0).toFixed(2);
}

// ⚡ اكتشاف فئة NFC
function detectCategory(product) {
  const name = product.name?.toLowerCase() || "";
  const cat = product.fullCategories?.[0]?.name?.toLowerCase() || "";

  if (name.includes("nfc") || cat.includes("nfc") || name.includes("بطاقة")) {
    return "3086"; // NFC Category
  }
  return "922"; // Electronics Accessories
}

/*===============================================
  5) Empty & Error Feeds
================================================*/
function emptyFeed() {
  return `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>No Products</title>
  </channel>
</rss>`;
}

function errorFeed() {
  return emptyFeed();
}
