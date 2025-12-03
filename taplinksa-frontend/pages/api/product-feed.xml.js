// TapLink SA – Google Merchant PRO Feed (Next.js Safe Version)
// Clean – Stable – No Unicode Errors – No Runtime Issues

import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("⚡ Generating PRO Merchant Feed...");

    const products = await fetchProducts();

    const xml = buildFeed(products);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    res.status(200).send(xml);

  } catch (err) {
    console.error("❌ Feed Error", err.message);
    res.status(500).send(errorFeed());
  }
}

/* =======================================================
   1) Fetch WooCommerce Products (Safe & Clean)
======================================================= */
async function fetchProducts() {
  try {
    const r = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
      {
        params: { per_page: 150, status: "publish" },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET
        },
        timeout: 15000
      }
    );

    return r.data;

  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    return [];
  }
}

/* =======================================================
   2) Build Feed
======================================================= */
function buildFeed(products) {
  const siteUrl = "https://taplinksa.com";
  const now = new Date().toISOString();

  const items = products.map((p) => buildItem(p, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA – NFC Cards & Digital Solutions]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[أفضل بطاقات NFC وحلول رقمية لمتجرك – شحن سريع لكل السعودية]]></description>
    <lastBuildDate>${now}</lastBuildDate>

${items}

  </channel>
</rss>`;
}

/* =======================================================
   3) Build Each Product Item – PRO Optimized
======================================================= */
function buildItem(product, siteUrl) {
  const id = product.id;

  /* ------------------------------------------
     (1) Safe Link – يدعم Slug عربي أو مشفهّر
  ------------------------------------------ */
  const safeSlug = cleanSlug(product.slug || id.toString());
  const link = `${siteUrl}/product/${safeSlug}`;

  /* ------------------------------------------
     (2) عنوان محسّن CTR (مهم لضرب الحملات)
  ------------------------------------------ */
  const title = makeTitle(product);

  /* ------------------------------------------
     (3) وصف قوي بدون HTML – Google Friendly
  ------------------------------------------ */
  const description = makeDescription(product);

  /* ------------------------------------------
     (4) صور – الصورة الأساسية فقط (Google يفضلها)
  ------------------------------------------ */
  const image = product.images?.[0]?.src || `${siteUrl}/placeholder.jpg`;

  /* ------------------------------------------
     (5) السعر
  ------------------------------------------ */
  const price = format(product.price);
  const salePrice =
    product.sale_price && product.sale_price < product.price
      ? format(product.sale_price)
      : "";

  /* ------------------------------------------
     (6) التوفر
  ------------------------------------------ */
  const availability =
    product.stock_status === "instock" ? "in stock" : "out of stock";

  /* ------------------------------------------
     (7) Google Product Category
  ------------------------------------------ */
  const googleCategory = detectCategory(product);

  return `
    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${image}</g:image_link>

      <g:price>${price} SAR</g:price>
      ${salePrice ? `<g:sale_price>${salePrice} SAR</g:sale_price>` : ""}

      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>

      <g:brand><![CDATA[TapLink SA]]></g:brand>

      <g:google_product_category>${googleCategory}</g:google_product_category>

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

/* =======================================================
   4) Helpers – Clean / Safe / Guaranteed
======================================================= */

// عناوين CTR عالية
function makeTitle(product) {
  const name = cleanText(product.name);

  const base =
    product.on_sale
      ? `🔥 عرض خاص ${name}`
      : product.featured
      ? `⭐ ${name}`
      : name;

  return `${base} | TapLink SA`.substring(0, 140);
}

// وصف Google Friendly
function makeDescription(product) {
  const raw =
    product.short_description ||
    product.description ||
    product.name ||
    "منتج عالي الجودة من TapLink SA";

  return cleanText(raw).substring(0, 4000);
}

// Clean Slug without breaking Arabic
function cleanSlug(slug) {
  return encodeURIComponent(slug).replace(/%/g, "");
}

// Clean Text safely
function cleanText(str = "") {
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Price formatting
function format(num) {
  return parseFloat(num || 0).toFixed(2);
}

// Detect Google Category
function detectCategory(product) {
  const name = (product.name || "").toLowerCase();

  if (name.includes("nfc") || name.includes("بطاقة")) return "3086";
  if (name.includes("اشتراك") || name.includes("digital")) return "313";

  return "922";
}

/* =======================================================
   5) Error Feed
======================================================= */
function errorFeed() {
  return `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0">
  <channel><title>Error</title></channel>
</rss>`;
}
