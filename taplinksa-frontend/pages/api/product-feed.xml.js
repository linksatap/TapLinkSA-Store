// pages/api/product-feed.xml.js - النسخة المثالية المُصححة
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log("🚀 Generating Google Merchant Feed v3.1...");
    
    const products = await fetchOptimizedProducts();
    if (!products?.length) {
      sendPerfectResponse(res, createEmptyFeed());
      return;
    }

    const feed = createUltimateFeed(products);
    sendPerfectResponse(res, feed);

  } catch (error) {
    console.error("❌ Feed failed:", error);
    sendPerfectResponse(res, createErrorFeed());
  }
}

/* ==============================
   1) Fetch Products ✅
   ============================== */
async function fetchOptimizedProducts() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`, {
        params: {
          per_page: 200,
          status: 'publish',
          stock_status: 'instock',
          orderby: 'date',
          order: 'desc',
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        timeout: 15000,
      }),
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products/categories`),
    ]);

    // ✅ إصلاح: p.id === cat.id (ليس category_id)
    return productsRes.data.map(product => ({
      ...product,
      categories: categoriesRes.data.filter(cat =>
        product.categories?.some(p => p.id === cat.id) // ✅ مُصحح
      ),
    }));

  } catch (e) {
    console.error("❌ Products fetch failed:", e.message);
    return [];
  }
}

/* ==============================
   2) Ultimate Feed ✅
   ============================== */
function createUltimateFeed(products) {
  const siteUrl = "https://taplinksa.com";
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[تاب لينك السعودية • بطاقات NFC الذكية وحلول التسويق]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[بطاقات NFC • Google Business • تصميم مواقع • اشتراكات رقمية • شحن لجميع السعودية]]></description>
    <pubDate>${now}</pubDate>
    <lastBuildDate>${now}</lastBuildDate>
    <language>ar-SA</language>

${products.map((p, i) => createProductXML(p, siteUrl, i)).join("\n")}
  </channel>
</rss>`;
}

/* ==============================
   3) Product Item ✅
   ============================== */
function createProductXML(product, siteUrl, index) {
  const id = product.id;
  const sku = escapeXml(product.sku || `TAPLINK-${id}`);

  const title = escapeXml(createCTRTitle(product));
  const description = escapeCDATA(createRichDescription(product));

  const canonical = `${siteUrl}/product/${cleanUrlSlug(product.slug)}?utm_source=google&utm_medium=shopping&utm_campaign=taplink`;

  const primaryImage = optimizeImage(product.images?.[0]?.src);
  const extraImages = (product.images || [])
    .slice(1, 10)
    .map(i => optimizeImage(i.src))
    .filter(Boolean);

  const price = `${formatPrice(product.price)} SAR`;
  const salePrice = product.sale_price && product.sale_price < product.price
    ? `${formatPrice(product.sale_price)} SAR`
    : "";

  const availability = getSmartAvailability(product);
  const gtin = getMeta(product, ["_gtin", "gtin", "_wc_gtin"]);
  const mpn = getMeta(product, ["_mpn", "mpn"]) || sku;

  const googleCategory = detectGoogleCategory(product);
  const productType = detectProductType(product);
  const attributes = extractAttributes(product);
  const customLabels = getSmartLabels(product);

  return `
    <item>
      <g:id>${id}</g:id>
      <g:sku>${sku}</g:sku>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>

      <g:link>${canonical}</g:link>
      <g:mobile_link>${canonical}</g:mobile_link>

      <g:image_link>${primaryImage}</g:image_link>
${extraImages.map(img => `      <g:additional_image_link>${img}</g:additional_image_link>`).join("\n")}

      <g:price>${price}</g:price>
${salePrice ? `      <g:sale_price>${salePrice}</g:sale_price>` : ""}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>

      <g:brand><![CDATA[TapLink SA]]></g:brand>
${gtin ? `      <g:gtin>${gtin}</g:gtin>` : `      <g:identifier_exists>no</g:identifier_exists>`}
      <g:mpn>${escapeXml(mpn)}</g:mpn>

      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${productType}]]></g:product_type>

${attributes.color ? `      <g:color>${escapeXml(attributes.color)}</g:color>` : ""}
${attributes.size ? `      <g:size>${escapeXml(attributes.size)}</g:size>` : ""}
${attributes.material ? `      <g:material>${escapeXml(attributes.material)}</g:material>` : ""}

      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>25 SAR</g:price>
      </g:shipping>

      <g:tax>
        <g:country>SA</g:country>
        <g:rate>15</g:rate>
        <g:tax_ship>true</g:tax_ship>
      </g:tax>

      <g:custom_label_0>${escapeXml(customLabels[0])}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(customLabels[1])}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(customLabels[2])}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(customLabels[3])}</g:custom_label_3>
      <g:custom_label_4>${escapeXml(customLabels[4])}</g:custom_label_4>
    </item>`;
}

/* ==============================
   4) Helper Functions ✅
   ============================== */
function createCTRTitle(product) {
  const base = cleanText(product.name);
  const category = product.categories?.[0]?.name || "";
  return `${base} | ${category} - تاب لينك السعودية`.substring(0, 140);
}

function createRichDescription(product) {
  const desc = cleanRichText(product.description || product.short_description);
  const specs = `📌 التقنية: NFC NTAG215\n✅ متوافق iPhone/Android\n📦 شحن مجاني للرياض\n💳 دفع عند الاستلام`;
  return `${desc}\n\n${specs}`.substring(0, 4800);
}

function optimizeImage(src) {
  if (!src) return "https://taplinksa.com/images/placeholder.jpg";
  return src.split("?")[0] + "?w=1200&h=1200&fit=crop&quality=85";
}

function getSmartAvailability(product) {
  switch (product.stock_status) {
    case "instock": return "in stock";
    case "onbackorder": return "backorder";
    default: return "out of stock";
  }
}

function detectGoogleCategory(product) {
  const text = (product.name || "").toLowerCase();
  if (text.includes("nfc") || text.includes("بطاقة")) {
    return "3086"; // NFC Technology
  }
  return "922"; // Electronics Accessories
}

function detectProductType(product) {
  return product.categories?.map(c => c.name).join(" > ") || "إلكترونيات";
}

function extractAttributes(product) {
  const attrs = product.attributes || [];
  return {
    color: getAttr(attrs, ["color", "اللون"]),
    size: getAttr(attrs, ["size", "الحجم"]),
    material: getAttr(attrs, ["material", "المادة"]),
  };
}

function getAttr(attrs, keys) {
  const attr = attrs.find(a => keys.includes((a.name || "").toLowerCase()));
  return attr?.options?.[0];
}

function getMeta(product, keys) {
  return product.meta_data?.find(m => keys.includes(m.key))?.value || "";
}

function getSmartLabels(product) {
  return [
    product.categories?.[0]?.name || "NFC",
    product.featured ? "مميز" : "عادي",
    product.on_sale ? "عرض" : "عادي",
    product.stock_status === "instock" ? "متوفر" : "نفاد",
    "TapLink SA",
  ];
}

function formatPrice(price) {
  return parseFloat(price || 0).toFixed(2);
}

function cleanText(text) {
  return (text || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-zA-Z0-9#]+;/g, "")
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g, "")
    .replace(/[^\w\u0600-\u06FF\s\-.,!؟]/g, "")
    .trim();
}

function cleanRichText(text) {
  return cleanText(text).substring(0, 2000);
}

function cleanUrlSlug(slug) {
  return (slug || "")
    .replace(/[^\w\u0600-\u06FF\-]/g, "")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80) || "product";
}

function escapeCDATA(str) {
  return String(str || "").replace(/]]>/g, "]]&gt;");
}

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sendPerfectResponse(res, xml) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
  res.setHeader("X-Robots-Tag", "noindex");
  res.status(200).send(xml);
}

function createEmptyFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>تاب لينك السعودية</title>
    <link>https://taplinksa.com</link>
    <description>جاري تحديث المنتجات</description>
  </channel>
</rss>`;
}

function createErrorFeed() {
  return createEmptyFeed();
}
