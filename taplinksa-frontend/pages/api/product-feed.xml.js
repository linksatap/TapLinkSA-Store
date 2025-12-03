function sanitizeCDATA(str = "") {
  return String(str)
    .replace(/<!\[CDATA\[/g, "")              // إزالة CDATA الموجودة أصلاً
    .replace(/]]>/g, "")                      // منع كسر CDATA
    .replace(/&(?!(amp;|lt;|gt;|quot;|apos;))/g, "&amp;") 
    .replace(/&#[0-9]+;/g, "")                // إزالة كيانات مكسورة
    .replace(/&#x[0-9A-F]+;/gi, "")           // إزالة يونكود HEX
    .replace(/<[^>]*>/g, "")                  // إزالة HTML + attributes
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")   // إزالة Emoji Faces
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")   // Misc symbols
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")   // Transport emoji
    .replace(/[\u{2600}-\u{27BF}]/g, "")      // Misc
    .replace(/\s{2,}/g, " ")                  // إزالة الفراغات
    .trim();
}


// pages/api/product-feed.xml.js - بدون أخطاء XML
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const products = await fetchProducts();
    const feed = buildFeed(products);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=1800');
    res.status(200).send(feed);
    
  } catch (error) {
    res.status(200).send(buildEmptyFeed());
  }
}

async function fetchProducts() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
      {
        params: { per_page: 100, status: 'publish' },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        timeout: 15000,
      }
    );
    return res.data;
  } catch (e) {
    return [];
  }
}

function buildFeed(products) {
  const now = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  hannel>
    <title><![CDATA[تاب لينك السعودية - بطاقات NFC]]></title>
    <link>https://taplinksa.com</link>
    <description><![CDATA[بطاقات NFC الذكية وحلول التسويق الرقمي]]></description>
    <pubDate>${now}</pubDate>

${products.map(p => buildItem(p)).join('\n')}
  </channel>
</rss>`;
}

function buildItem(product) {
  const id = product.id;
  const sku = escapeXml(product.sku || `TAPLINK-${id}`);
  const title = cleanForCDATA(product.name);
  const desc = cleanForCDATA(product.description || product.short_description);
  const price = parseFloat(product.price || 0).toFixed(2);
  const img = product.images?.[0]?.src || 'https://taplinksa.com/placeholder.jpg';
  
  return `    <item>
      <g:id>${id}</g:id>
      <g:sku>${sku}</g:sku>
<g:title><![CDATA[${sanitizeCDATA(title)}]]></g:title>
<g:description><![CDATA[${sanitizeCDATA(description)}]]></g:description>
      <g:link>https://taplinksa.com/product/${product.slug || id}</g:link>
      <g:image_link>${img}</g:image_link>
      <g:price>${price} SAR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>TapLink SA</g:brand>
      <g:google_product_category>3086</g:google_product_category>
    </item>`;
}

// ✅ دوال التنظيف الصحيحة
function cleanForCDATA(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/gu, "")
    .replace(/]]>/g, "]]&gt;")
    .trim()
    .substring(0, 5000);
}

function escapeXml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildEmptyFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  hannel>
    <title>تاب لينك السعودية</title>
    <link>https://taplinksa.com</link>
    <description>جاري التحديث</description>
  </channel>
</rss>`;
}
