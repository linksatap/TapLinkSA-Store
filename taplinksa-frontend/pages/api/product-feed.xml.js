// app/api/product-feed.xml/route.js
import axios from "axios";
import { NextResponse } from "next/server";

/* ==============================
   MAIN ROUTE
============================== */
export async function GET() {
  try {
    const products = await fetchProducts();
    const xml = products.length ? buildFeed(products) : emptyFeed();
    
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=1800, stale-while-revalidate",
        "X-Robots-Tag": "noindex",
      }
    });

  } catch (err) {
    console.error("Feed Error:", err);
    return new NextResponse(errorFeed(), {
      status: 500,
      headers: { "Content-Type": "application/xml" }
    });
  }
}

/* ==============================
   FETCH PRODUCTS
============================== */
async function fetchProducts() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`, {
        params: {
          per_page: 200,
          status: "publish",
          stock_status: "instock",
          orderby: "date",
          order: "desc",
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        timeout: 15000,
      }),
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products/categories`)
    ]);

    return productsRes.data.map(p => ({
      ...p,
      categories: categoriesRes.data.filter(cat =>
        p.categories?.some(c => c.id === cat.id)
      ),
    }));

  } catch (e) {
    console.error("Fetch error:", e.message);
    return [];
  }
}

/* ==============================
   BUILD FEED (XML)
============================== */
function buildFeed(products) {
  const siteUrl = "https://taplinksa.com";
  const now = new Date().toISOString();

  const items = products.map(product => buildProduct(product, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA • NFC Cards Feed]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[NFC Cards • Google Business Solutions]]></description>
    <lastBuildDate>${now}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

/* ==============================
   BUILD PRODUCT ITEM
============================== */
function buildProduct(product, siteUrl) {
  const id = product.id;
  const sku = escapeXML(product.sku || `TAP-${id}`);
  const link = `${siteUrl}/product/${cleanSlug(product.slug)}?utm_source=google`;

  const image = optimizeImage(product.images?.[0]?.src);
  const extraImages = (product.images || [])
    .slice(1, 10)
    .map(i => `<g:additional_image_link>${i.src}</g:additional_image_link>`)
    .join("");

  const price = `${format(product.price)} SAR`;
  const sale = product.sale_price && product.sale_price < product.price
    ? `<g:sale_price>${format(product.sale_price)} SAR</g:sale_price>`
    : "";

  const category = detectCategory(product);
  const productType = product.categories?.map(c => c.name).join(" > ") || "NFC";

  return `
<item>
  <g:id>${id}</g:id>
  <g:title><![CDATA[${cleanText(product.name)} - TapLink SA]]></g:title>
  <g:description><![CDATA[${cleanText(product.short_description || product.description)}]]></g:description>

  <g:link>${link}</g:link>
  <g:image_link>${image}</g:image_link>
  ${extraImages}

  <g:price>${price}</g:price>
  ${sale}

  <g:availability>${product.stock_status === "instock" ? "in stock" : "out of stock"}</g:availability>
  <g:condition>new</g:condition>

  <g:brand>TapLink SA</g:brand>
  <g:identifier_exists>no</g:identifier_exists>

  <g:google_product_category>${category}</g:google_product_category>
  <g:product_type><![CDATA[${productType}]]></g:product_type>

  <g:shipping>
    <g:country>SA</g:country>
    <g:service>Standard</g:service>
    <g:price>0 SAR</g:price>
  </g:shipping>

  <g:tax>
    <g:country>SA</g:country>
    <g:rate>15</g:rate>
  </g:tax>
</item>`;
}

/* ==============================
   UTILITIES
============================== */

function cleanText(str = "") {
  return str.replace(/<[^>]*>/g, "").trim();
}

function cleanSlug(slug = "") {
  return slug.replace(/[^\w\u0600-\u06FF-]/g, "");
}

function escapeXML(t = "") {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function optimizeImage(src) {
  if (!src) return "https://taplinksa.com/placeholder.jpg";
  return src.split("?")[0] + "?w=1200&h=1200&fit=crop&quality=85";
}

function format(n) {
  return parseFloat(n || 0).toFixed(2);
}

function detectCategory(product) {
  const name = product.name?.toLowerCase() || "";
  const cat = product.categories?.[0]?.name?.toLowerCase() || "";

  if (name.includes("nfc") || cat.includes("nfc") || name.includes("بطاقة")) {
    return "3086"; // NFC Category
  }
  return "111";
}

/* ==============================
   EMPTY & ERROR FEEDS
============================== */
function emptyFeed() {
  return `
<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>No Products</title>
  </channel>
</rss>`;
}

function errorFeed() {
  return `
<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Error</title>
  </channel>
</rss>`;
}
