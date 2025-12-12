// pages/api/google-feed.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("⚡ Generating Google Merchant Feed...");

    const products = await fetchProducts();
    console.log(`📦 Products found: ${products.length}`);

    const xml = buildFeed(products);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // ✅ Cache لمدة ساعة
    res.status(200).send(xml);

  } catch (err) {
    console.error("❌ Feed Error:", err.message);
    res.status(500).send(errorFeed());
  }
}

// ✅ جلب المنتجات مع Pagination
async function fetchProducts() {
  try {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
        {
          params: { 
            per_page: 100, 
            page,
            status: "publish",
            stock_status: "instock", // ✅ فقط المنتجات المتوفرة
          },
          auth: {
            username: process.env.WC_CONSUMER_KEY,
            password: process.env.WC_CONSUMER_SECRET
          },
          timeout: 15000
        }
      );

      allProducts = [...allProducts, ...response.data];

      // ✅ التحقق من وجود صفحات إضافية
      const totalPages = parseInt(response.headers['x-wp-totalpages']);
      hasMore = page < totalPages;
      page++;
    }

    return allProducts;

  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    return [];
  }
}

function buildFeed(products) {
  const siteUrl = "https://taplinksa.com";
  const now = new Date().toISOString();

  if (!products || products.length === 0) {
    return emptyFeed();
  }

  // ✅ تصفية المنتجات الصالحة فقط
  const validProducts = products.filter(p => 
    p.price && 
    p.name && 
    p.images?.[0]?.src &&
    p.stock_status === "instock"
  );

  const items = validProducts.map((p) => buildItem(p, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[TapLink SA – بطاقات NFC الذكية واشتراكات رقمية]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[متجر تاب لينك السعودية - بطاقات NFC ذكية، اشتراكات نتفليكس، شاهد، OSN وجميع الخدمات الرقمية]]></description>
    <lastBuildDate>${now}</lastBuildDate>

${items}

  </channel>
</rss>`;
}

// pages/api/google-feed.js

function buildItem(product, siteUrl) {
  const id = product.id;
  
  // ✅ إنشاء رابط Next.js بدلاً من استخدام permalink من WordPress
  const productSlug = product.slug || id;
  const productUrl = `${siteUrl}/shop/${encodeURIComponent(productSlug)}`;

  const title = makeTitle(product);
  const description = makeDescription(product);
  const image = getDirectImageUrl(product.images?.[0]?.src);

  const price = format(product.price);
  const salePrice = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price)
    ? format(product.sale_price)
    : "";

  const availability = product.stock_status === "instock" ? "in stock" : "out of stock";
  
  const isDigital = product.virtual || product.downloadable || isDigitalProduct(product);
  const googleCategory = detectCategory(product);
  const productType = getProductType(product);

  const hasIdentifier = product.sku && product.sku.length > 5;
  const identifierExists = hasIdentifier ? "" : '<g:identifier_exists>false</g:identifier_exists>';

  return `
    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${productUrl}</g:link>
      
      <g:image_link>${image}</g:image_link>
      ${buildAdditionalImages(product)}

      <g:price>${price} SAR</g:price>
      ${salePrice ? `<g:sale_price>${salePrice} SAR</g:sale_price>` : ""}

      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>

      <g:brand><![CDATA[TapLink SA]]></g:brand>
      ${hasIdentifier ? `<g:mpn><![CDATA[${product.sku}]]></g:mpn>` : ""}
      ${identifierExists}

      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${productType}]]></g:product_type>

      <g:adult>no</g:adult>
      <g:is_bundle>no</g:is_bundle>

      ${buildShipping(isDigital, product)}
      ${buildTax()}
    </item>`;
}

// ✅ إضافة صور إضافية
function buildAdditionalImages(product) {
  if (!product.images || product.images.length <= 1) return "";
  
  return product.images
    .slice(1, 11) // max 10 additional images
    .map(img => `<g:additional_image_link>${getDirectImageUrl(img.src)}</g:additional_image_link>`)
    .join("\n      ");
}

function isDigitalProduct(product) {
  const name = (product.name || "").toLowerCase();
  const categories = product.categories?.map(c => c.name.toLowerCase()).join(" ") || "";
  
  const digitalKeywords = [
    'اشتراك', 'subscription', 'netflix', 'shahid', 'osn', 
    'spotify', 'youtube', 'digital', 'رقمي', 'تفعيل',
    'كود', 'code', 'voucher', 'بطاقة شحن', 'رصيد'
  ];
  
  return digitalKeywords.some(keyword => 
    name.includes(keyword) || categories.includes(keyword)
  );
}

// ✅ Product Type (التصنيف الداخلي)
function getProductType(product) {
  if (isDigitalProduct(product)) {
    return "الاشتراكات الرقمية > خدمات البث";
  }
  
  const name = (product.name || "").toLowerCase();
  
  if (name.includes("nfc") || name.includes("بطاقة")) {
    return "بطاقات NFC > بطاقات ذكية";
  }
  
  if (name.includes("ستاند") || name.includes("stand")) {
    return "إكسسوارات > ستاندات عرض";
  }
  
  return "منتجات تاب لينك > متنوعة";
}

// ✅ الشحن المحسّن
function buildShipping(isDigital, product) {
  if (isDigital) {
    return `
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Instant Digital Delivery</g:service>
        <g:price>0.00 SAR</g:price>
      </g:shipping>`;
  }
  
  // ✅ شحن مجاني للطلبات فوق 199 ريال
  const price = parseFloat(product.price);
  const shippingCost = price >= 199 ? "0.00" : "25.00";
  
  return `
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard Shipping</g:service>
        <g:price>${shippingCost} SAR</g:price>
      </g:shipping>`;
}

function buildTax() {
  return `
      <g:tax>
        <g:country>SA</g:country>
        <g:rate>15</g:rate>
        <g:tax_ship>yes</g:tax_ship>
      </g:tax>`;
}

function getDirectImageUrl(imageSrc) {
  if (!imageSrc) {
    return "https://taplinksa.com/images/placeholder.jpg";
  }
  
  let cleanUrl = imageSrc.split('?')[0];
  cleanUrl = cleanUrl.replace(/-\d+x\d+(\.[^.]+)$/, '$1');
  
  // ✅ تأكد من https
  cleanUrl = cleanUrl.replace(/^http:/, 'https:');
  
  return cleanUrl;
}

function makeTitle(product) {
  const name = cleanText(product.name);
  
  const isDigital = isDigitalProduct(product);
  const emoji = isDigital ? '🎬' : (product.on_sale ? '🔥' : '');
  
  // ✅ تحسين العنوان لـ SEO
  let title = `${emoji} ${name}`.trim();
  
  // إضافة كلمات مفتاحية
  if (isDigital) {
    title += " - اشتراك رقمي";
  }
  
  return title.substring(0, 150); // Google limit
}

function makeDescription(product) {
  const raw = product.short_description || product.description || product.name || "";
  let baseDesc = cleanText(raw);
  
  const isDigital = isDigitalProduct(product);
  
  // ✅ إضافة معلومات تسويقية
  if (isDigital) {
    baseDesc += "\n\n✅ تسليم فوري - يصلك الكود خلال دقائق عبر البريد الإلكتروني";
    baseDesc += "\n✅ دعم فني 24/7";
    baseDesc += "\n✅ ضمان استرجاع المبلغ";
  } else {
    baseDesc += "\n\n📦 شحن سريع لجميع مدن السعودية";
    baseDesc += "\n💳 دفع عند الاستلام";
    baseDesc += "\n🔒 ضمان أصلي 100%";
  }
  
  return baseDesc.substring(0, 5000); // Google max
}

function cleanText(str = "") {
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s\u0600-\u06FF\-.,!?()]/g, "") // حفظ العربية والإنجليزية فقط
    .trim();
}

function format(num) {
  return parseFloat(num || 0).toFixed(2);
}

function detectCategory(product) {
  const name = (product.name || "").toLowerCase();
  const categories = product.categories?.map(c => c.name.toLowerCase()).join(" ") || "";
  
  // ✅ تصنيفات Google الدقيقة
  const categoryMap = {
    // اشتراكات رقمية
    'netflix': '313',    // Digital > Subscriptions
    'shahid': '313',
    'osn': '313',
    'spotify': '313',
    'youtube': '313',
    'اشتراك': '313',
    
    // بطاقات NFC
    'nfc': '3086',       // Electronics > Communication > NFC
    'بطاقة': '3086',
    
    // ستاندات
    'ستاند': '696',      // Office Supplies > Display
    'stand': '696',
    
    // خدمات تصميم
    'تصميم': '1022',     // Business Services
    'design': '1022',
    'google business': '1022',
  };
  
  for (const [keyword, id] of Object.entries(categoryMap)) {
    if (name.includes(keyword) || categories.includes(keyword)) {
      return id;
    }
  }
  
  return '922'; // Electronics Accessories (Default)
}

function emptyFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>TapLink SA</title>
    <link>https://taplinksa.com</link>
    <description>جاري تحديث المنتجات...</description>
  </channel>
</rss>`;
}

function errorFeed() {
  return emptyFeed();
}
