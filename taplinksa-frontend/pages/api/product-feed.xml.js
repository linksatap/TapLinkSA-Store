// TapLink SA – Google Merchant Feed (النسخة النهائية الآمنة)
import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("⚡ Generating Feed...");

    const products = await fetchProducts();
    
    // ✅ تحقق من وجود منتجات
    console.log(`📦 Products found: ${products.length}`);

    const xml = buildFeed(products);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // ✅ منع Cache
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.status(200).send(xml);

  } catch (err) {
    console.error("❌ Feed Error:", err.message);
    res.status(500).send(errorFeed());
  }
}

async function fetchProducts() {
  try {
    console.log("🔄 Fetching products from WooCommerce...");
    
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`;
    console.log("📍 API URL:", url);

    const r = await axios.get(url, {
      params: { 
        per_page: 100, 
        status: "publish",
        // ✅ إزالة شرط stock_status للحصول على جميع المنتجات
      },
      auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET
      },
      timeout: 15000
    });

    console.log("✅ Products received:", r.data.length);
    return r.data;

  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    console.error("❌ Response:", err.response?.status, err.response?.statusText);
    
    // ✅ Fallback: منتجات تجريبية
    return getDemoProducts();
  }
}



function buildFeed(products) {
  const siteUrl = "https://taplinksa.com";
  const now = new Date().toISOString();

  // ✅ تحقق من وجود منتجات
  if (!products || products.length === 0) {
    console.warn("⚠️ No products to generate feed");
    return emptyFeed();
  }

  const items = products.map((p) => buildItem(p, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA – NFC Cards & Digital Solutions]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[أفضل بطاقات NFC وحلول رقمية – شحن سريع لكل السعودية]]></description>
    <lastBuildDate>${now}</lastBuildDate>

${items}

  </channel>
</rss>`;
}

function buildItem(product, siteUrl) {
  const id = product.id;
  
  // ✅ رابط آمن 100%
  const productUrl = product.permalink || `${siteUrl}/shop/${encodeURIComponent(product.slug || id)}`;

  const title = makeTitle(product);
  const description = makeDescription(product);
  const image = getDirectImageUrl(product.images?.[0]?.src);

  const price = format(product.price);
  const salePrice = product.sale_price && product.sale_price < product.price
    ? format(product.sale_price)
    : "";

  const availability = product.stock_status === "instock" ? "in stock" : "out of stock";
  const googleCategory = detectCategory(product);

  return `
    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${productUrl}</g:link>
      
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

function getDirectImageUrl(imageSrc) {
  if (!imageSrc) {
    return "https://cms.taplinksa.com/wp-content/uploads/placeholder.jpg";
  }
  
  let cleanUrl = imageSrc.split('?')[0];
  cleanUrl = cleanUrl.replace(/-\d+x\d+(\.[^.]+)$/, '$1');
  return cleanUrl;
}

function makeTitle(product) {
  const name = cleanText(product.name);
  return `${name} | متجر تاب لينك`.substring(0, 140);
}

function makeDescription(product) {
  const raw = product.short_description || product.description || product.name || "منتج عالي الجودة";
  return cleanText(raw).substring(0, 4000);
}

function cleanText(str = "") {
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function format(num) {
  return parseFloat(num || 0).toFixed(2);
}

function detectCategory(product) {
  const name = (product.name || "").toLowerCase();
  if (name.includes("nfc") || name.includes("بطاقة")) return "3086";
  if (name.includes("اشتراك")) return "313";
  return "922";
}

function emptyFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>TapLink SA</title>
    <link>https://taplinksa.com</link>
    <description>No products available</description>
  </channel>
</rss>`;
}

function errorFeed() {
  return emptyFeed();
}
