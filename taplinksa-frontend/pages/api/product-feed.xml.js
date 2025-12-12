// TapLink SA – Feed محسّن لجميع أنواع المنتجات
import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("⚡ Generating Feed...");

    const products = await fetchProducts();
    console.log(`📦 Products found: ${products.length}`);

    const xml = buildFeed(products);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(xml);

  } catch (err) {
    console.error("❌ Feed Error:", err.message);
    res.status(500).send(errorFeed());
  }
}

async function fetchProducts() {
  try {
    const r = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
      {
        params: { per_page: 100, status: "publish" },
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
    return getDemoProducts();
  }
}



function buildFeed(products) {
  const siteUrl = "https://taplinksa.com";
  const now = new Date().toISOString();

  if (!products || products.length === 0) {
    return emptyFeed();
  }

  const items = products.map((p) => buildItem(p, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA – NFC Cards & Digital Solutions]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[بطاقات NFC الذكية واشتراكات رقمية لجميع الخدمات – شحن سريع]]></description>
    <lastBuildDate>${now}</lastBuildDate>

${items}

  </channel>
</rss>`;
}

function buildItem(product, siteUrl) {
  const id = product.id;
  const productUrl = product.permalink || `${siteUrl}/shop/${encodeURIComponent(product.slug || id)}`;

  const title = makeTitle(product);
  const description = makeDescription(product);
  const image = getDirectImageUrl(product.images?.[0]?.src);

  const price = format(product.price);
  const salePrice = product.sale_price && product.sale_price < product.price
    ? format(product.sale_price)
    : "";

  const availability = product.stock_status === "instock" ? "in stock" : "out of stock";
  
  // ✅ تحديد نوع المنتج
  const isDigital = product.virtual || product.downloadable || isDigitalProduct(product);
  
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

      ${buildShipping(isDigital)}
      ${buildTax(isDigital)}
    </item>`;
}

// ✅ دالة تحديد المنتجات الرقمية
function isDigitalProduct(product) {
  const name = (product.name || "").toLowerCase();
  const digitalKeywords = [
    'اشتراك', 'subscription', 'netflix', 'shahid', 'osn', 
    'spotify', 'youtube', 'digital', 'رقمي', 'تفعيل',
    'كود', 'code', 'voucher', 'بطاقة شحن'
  ];
  
  return digitalKeywords.some(keyword => name.includes(keyword));
}

// ✅ الشحن حسب نوع المنتج
function buildShipping(isDigital) {
  if (isDigital) {
    // منتج رقمي = شحن فوري مجاني
    return `
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Digital Delivery</g:service>
        <g:price>0 SAR</g:price>
      </g:shipping>`;
  } else {
    // منتج فيزيائي = شحن عادي
    return `
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>0 SAR</g:price>
      </g:shipping>`;
  }
}

// ✅ الضرائب (15% لجميع المنتجات في السعودية)
function buildTax(isDigital) {
  return `
      <g:tax>
        <g:country>SA</g:country>
        <g:rate>15</g:rate>
      </g:tax>`;
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
  
  // ✅ إضافة emoji حسب نوع المنتج
  const isDigital = isDigitalProduct(product);
  const emoji = isDigital ? '🎬' : product.on_sale ? '🔥' : '';
  
  return `${emoji} ${name} | متجر تاب لينك`.substring(0, 140);
}

function makeDescription(product) {
  const raw = product.short_description || product.description || product.name || "منتج عالي الجودة";
  const baseDesc = cleanText(raw);
  
  // ✅ إضافة وصف حسب نوع المنتج
  const isDigital = isDigitalProduct(product);
  const extraInfo = isDigital 
    ? "\n\n🎁 تسليم فوري - يصلك الكود عبر البريد الإلكتروني خلال دقائق"
    : "\n\n📦 شحن سريع لجميع مدن السعودية - دفع عند الاستلام";
  
  return (baseDesc + extraInfo).substring(0, 4000);
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

// ✅ تحسين detectCategory
function detectCategory(product) {
  const name = (product.name || "").toLowerCase();
  
  // اشتراكات رقمية
  const digitalKeywords = ['اشتراك', 'subscription', 'netflix', 'shahid', 'osn', 'spotify', 'youtube'];
  if (digitalKeywords.some(kw => name.includes(kw))) {
    return "313"; // Digital Goods & Services
  }
  
  // بطاقات NFC
  if (name.includes("nfc") || name.includes("بطاقة")) {
    return "3086"; // NFC Technology
  }
  
  // ستاندات وأجهزة
  if (name.includes("ستاند") || name.includes("stand")) {
    return "696"; // Display Stands
  }
  
  // خدمات تصميم
  if (name.includes("تصميم") || name.includes("design") || name.includes("google business")) {
    return "1022"; // Business & Industrial
  }
  
  return "922"; // Electronics Accessories (Default)
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
