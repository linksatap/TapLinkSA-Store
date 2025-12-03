// TapLink SA – Google Merchant PRO Feed (إصلاح الروابط النهائي)
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

function buildItem(product, siteUrl) {
  const id = product.id;
  
  /* ------------------------------------------
     ✅ إصلاح الرابط: /shop/ + slug صحيح
  ------------------------------------------ */
  const productUrl = getProductUrl(product, siteUrl);

  const title = makeTitle(product);
  const description = makeDescription(product);

  const image = getDirectImageUrl(product.images?.[0]?.src);
  
  const additionalImages = (product.images || [])
    .slice(1, 10)
    .map(img => getDirectImageUrl(img.src))
    .filter(Boolean);

  const price = format(product.price);
  const salePrice =
    product.sale_price && product.sale_price < product.price
      ? format(product.sale_price)
      : "";

  const availability =
    product.stock_status === "instock" ? "in stock" : "out of stock";

  const googleCategory = detectCategory(product);

  return `
    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${productUrl}</g:link>
      
      <g:image_link>${image}</g:image_link>
${additionalImages.map(img => `      <g:additional_image_link>${img}</g:additional_image_link>`).join('\n')}

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
   ✅ دالة رابط المنتج الصحيح
======================================================= */
function getProductUrl(product, siteUrl) {
  // إذا كان هناك permalink كامل من WooCommerce
  if (product.permalink) {
    return product.permalink;
  }
  
  // ✅ استخدام /shop/ بدلاً من /product/
  const slug = product.slug || product.id.toString();
  
  // ✅ encodeURIComponent بدون إزالة %
  const encodedSlug = encodeURIComponent(slug);
  
  return `${siteUrl}/shop/${encodedSlug}`;
}

function getDirectImageUrl(imageSrc) {
  if (!imageSrc) {
    return "https://cms.taplinksa.com/wp-content/uploads/placeholder-nfc.jpg";
  }

  try {
    let cleanUrl = imageSrc.split('?')[0];
    cleanUrl = cleanUrl.replace(/-\d+x\d+(\.[^.]+)$/, '$1');
    return cleanUrl;
    
  } catch (e) {
    return "https://cms.taplinksa.com/wp-content/uploads/placeholder-nfc.jpg";
  }
}

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

function makeDescription(product) {
  const raw =
    product.short_description ||
    product.description ||
    product.name ||
    "منتج عالي الجودة من TapLink SA";

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
  if (name.includes("اشتراك") || name.includes("digital")) return "313";

  return "922";
}

function errorFeed() {
  return `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0">
  <channel><title>Error</title></channel>
</rss>`;
}
