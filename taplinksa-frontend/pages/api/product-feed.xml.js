// pages/api/product-feed.xml.js - النسخة المثالية المُصححة
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('🚀 Google Merchant Feed v5.0 - Perfect');
    
    const products = await fetchOptimizedProducts();
    
    if (!products?.length) {
      res.status(200).send(createEmptyFeed());
      return;
    }

    const feed = createUltimateFeed(products);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.status(200).send(feed);
    
    console.log(`✅ Feed ready: ${products.length} products`);
    
  } catch (error) {
    console.error('❌ Feed failed:', error);
    res.status(200).send(createErrorFeed());
  }
}

// ================================
// 1. جلب المنتجات ✅
// ================================
async function fetchOptimizedProducts() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`, {
        params: {
          per_page: 100,
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
      axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }),
    ]);

    return productsRes.data.map(product => ({
      ...product,
      fullCategories: categoriesRes.data.filter(cat =>
        product.categories?.some(pCat => pCat.id === cat.id) // ✅ مُصحح
      ),
    }));
    
  } catch (error) {
    console.error('Fetch failed:', error.message);
    return [];
  }
}

// ================================
// 2. Feed محسّن ✅
// ================================
function createUltimateFeed(products) {
  const siteUrl = 'https://taplinksa.com';
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[تاب لينك السعودية - بطاقات NFC الذكية وحلول التسويق الرقمي]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[بطاقات NFC ✓ إدارة Google Business ✓ اشتراكات رقمية ✓ شحن مجاني السعودية]]></description>
    <pubDate>${now}</pubDate>
    <lastBuildDate>${now}</lastBuildDate>
    <language>ar-SA</language>

${products.map((p, i) => createProductItem(p, siteUrl, i)).join('\n')}
  </channel>
</rss>`;
}

// ================================
// 3. عنصر المنتج ✅
// ================================
function createProductItem(product, siteUrl, index) {
  const id = product.id;
  const sku = product.sku || `TAPLINK-${id}`;
  
  const title = createCTRTitle(product);
  const description = createRichDescription(product);
  const canonical = createCanonicalUrl(product, siteUrl);
  
  const primaryImage = optimizeImage(product.images?.[0]?.src);
  const additionalImages = (product.images || [])
    .slice(1, 10)
    .map(img => optimizeImage(img.src))
    .filter(Boolean);
  
  const price = formatPrice(product.price);
  const salePrice = product.sale_price && product.sale_price < product.price
    ? formatPrice(product.sale_price)
    : '';
  
  const availability = getAvailability(product);
  const gtin = getMeta(product, ['_gtin', 'gtin', '_wc_gtin']);
  const mpn = getMeta(product, ['_mpn', 'mpn']) || sku;
  
  const googleCategory = getGoogleCategory(product);
  const productType = getProductType(product);
  const attributes = extractAttributes(product);
  const labels = getCustomLabels(product);

  return `    <item>
      <g:id>${id}</g:id>
      <g:sku>${escapeXml(sku)}</g:sku>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      
      <g:link>${canonical}</g:link>
      <g:mobile_link>${canonical}</g:mobile_link>
      
      <g:image_link>${primaryImage}</g:image_link>
${additionalImages.map(img => `      <g:additional_image_link>${img}</g:additional_image_link>`).join('\n')}
      
      <g:price>${price} SAR</g:price>
${salePrice ? `      <g:sale_price>${salePrice} SAR</g:sale_price>` : ''}
      
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      
      <g:brand><![CDATA[TapLink SA]]></g:brand>
${gtin ? `      <g:gtin>${gtin}</g:gtin>` : `      <g:identifier_exists>no</g:identifier_exists>`}
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${productType}]]></g:product_type>
      
${attributes.color ? `      <g:color>${escapeXml(attributes.color)}</g:color>` : ''}
${attributes.size ? `      <g:size>${escapeXml(attributes.size)}</g:size>` : ''}
${attributes.material ? `      <g:material>${escapeXml(attributes.material)}</g:material>` : ''}
      
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
      
      <g:custom_label_0>${escapeXml(labels[0])}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(labels[1])}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(labels[2])}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(labels[3])}</g:custom_label_3>
      <g:custom_label_4>TapLink SA</g:custom_label_4>
    </item>`;
}

// ================================
// 4. دوال مساعدة ✅
// ================================

function createCTRTitle(product) {
  const base = cleanText(product.name);
  const cat = product.fullCategories?.[0]?.name || product.categories?.[0]?.name || '';
  const emoji = product.on_sale ? '🔥 ' : product.featured ? '⭐ ' : '';
  
  let title = `${emoji}${base}`;
  if (cat && !title.includes(cat)) {
    title += ` | ${cat}`;
  }
  title += ' - تاب لينك';
  
  return title.substring(0, 140);
}

function createRichDescription(product) {
  const desc = cleanText(product.description || product.short_description);
  const specs = `

📌 المواصفات:
- تقنية NFC NTAG215
- متوافق مع iPhone و Android
- شحن سريع لجميع مناطق السعودية
- دفع عند الاستلام
- ضمان سنة كاملة
- دعم فني 24/7`;
  
  return (desc + specs).substring(0, 4800);
}

function createCanonicalUrl(product, siteUrl) {
  const slug = cleanUrlSlug(product.slug || product.id.toString());
  return `${siteUrl}/product/${slug}?utm_source=google&utm_medium=shopping&utm_campaign=merchant`;
}

function optimizeImage(src) {
  if (!src) return 'https://taplinksa.com/images/placeholder.jpg';
  return src.split('?')[0] + '?w=1200&h=1200&fit=crop&quality=85';
}

function formatPrice(price) {
  return parseFloat(price || 0).toFixed(2);
}

function getAvailability(product) {
  switch (product.stock_status) {
    case 'instock': return 'in stock';
    case 'onbackorder': return 'backorder';
    default: return 'out of stock';
  }
}

function getMeta(product, keys) {
  for (const key of keys) {
    const meta = product.meta_data?.find(m => m.key === key);
    if (meta?.value) return meta.value;
  }
  return '';
}

function getGoogleCategory(product) {
  const text = (product.name || '').toLowerCase();
  if (text.includes('nfc') || text.includes('بطاقة')) {
    return '3086'; // NFC Technology
  }
  return '922'; // Electronics Accessories
}

function getProductType(product) {
  const cats = product.fullCategories || product.categories || [];
  return cats.map(c => c.name).join(' > ') || 'إلكترونيات';
}

function extractAttributes(product) {
  const attrs = product.attributes || [];
  return {
    color: attrs.find(a => ['color', 'اللون'].includes((a.name || '').toLowerCase()))?.options?.[0],
    size: attrs.find(a => ['size', 'الحجم'].includes((a.name || '').toLowerCase()))?.options?.[0],
    material: attrs.find(a => ['material', 'المادة'].includes((a.name || '').toLowerCase()))?.options?.[0],
  };
}

function getCustomLabels(product) {
  return [
    product.categories?.[0]?.name || 'NFC',
    product.featured ? 'مميز' : 'عادي',
    product.on_sale ? 'عرض' : 'عادي',
    product.stock_status === 'instock' ? 'متوفر' : 'نفاد',
  ];
}

function cleanText(text) {
  return (text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-zA-Z0-9#]+;/g, '')
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g, '') // إزالة Emoji
    .replace(/[^\w\u0600-\u06FF\s\-.,!؟]/g, '')
    .trim();
}

function cleanUrlSlug(slug) {
  return (slug || '')
    .replace(/[^\w\u0600-\u06FF\-]/g, '')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80) || 'product';
}

function escapeXml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
