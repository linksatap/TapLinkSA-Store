// pages/api/product-feed.xml.js - النسخة المُصححة
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('🔄 Generating Fixed Google Merchant Feed...');
    
    const products = await fetchAllProducts();
    
    if (!products || products.length === 0) {
      return res.status(404).send(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  hannel>
    <title>تاب لينك السعودية - منتجات</title>
    <link>https://taplinksa.com</link>
    <description>لا توجد منتجات حالياً</description>
  </channel>
</rss>`);
    }

    const feed = generateFixedFeed(products);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate'); // 30 دقيقة
    res.status(200).send(feed);
    
  } catch (error) {
    console.error('❌ Feed Error:', error.message);
    res.status(500).send(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  hannel>
    <title>تاب لينك السعودية - خطأ مؤقت</title>
    <link>https://taplinksa.com</link>
    <description>خطأ في تحديث البيانات، جاري الإصلاح</description>
  </channel>
</rss>`);
  }
}

// جلب المنتجات مع Error Handling
async function fetchAllProducts() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
      {
        params: {
          per_page: 100,
          status: 'publish',
          stock_status: 'instock',
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        timeout: 15000,
      }
    );
    
    console.log(`✅ Loaded ${response.data.length} products`);
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    return [];
  }
}

// إنشاء Feed مُصحح
function generateFixedFeed(products) {
  const siteUrl = 'https://taplinksa.com';
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  hannel>
    <title><![CDATA[تاب لينك السعودية - بطاقات NFC الذكية]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[بطاقات NFC الذكية وحلول التسويق الرقمي في السعودية]]></description>
    <lastBuildDate>${now}</lastBuildDate>
${products.map(p => generateFixedProductItem(p, siteUrl)).join('\n')}
  </channel>
</rss>`;
}

// 🔥 العنصر المُصحح - الجزء الأساسي
function generateFixedProductItem(product, siteUrl) {
  const id = product.id;
  
  // ✅ تصحيح URL العربي - الحل الأساسي
  let link = product.slug 
    ? `${siteUrl}/product/${encodeURIComponent(product.slug)}`
    : `${siteUrl}/product/${id}`;
    
  // ✅ إزالة الأحرف الخطرة من الـ slug
  const safeSlug = product.slug 
    ? product.slug.replace(/[^\w\u0600-\u06FF-]/g, '').substring(0, 100)
    : id.toString();
    
  link = `${siteUrl}/product/${safeSlug}`;
  
  // العنوان المُنظف
  const title = cleanTitle(product.name);
  
  // الوصف المُنظف
  const description = cleanDescription(product.short_description || product.description || title);
  
  // الصورة
  const imageLink = product.images[0]?.src || `${siteUrl}/placeholder.jpg`;
  
  // السعر
  const price = `${Math.round(parseFloat(product.price || 0) * 100) / 100} SAR`;
  const salePrice = product.sale_price && product.sale_price !== product.price 
    ? `${Math.round(parseFloat(product.sale_price) * 100) / 100} SAR`
    : '';
  
  // التوفر
  const availability = product.stock_status === 'instock' ? 'in stock' : 'out of stock';
  
  return `    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:price>${price}</g:price>
      ${salePrice ? `<g:sale_price>${salePrice}</g:sale_price>` : ''}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>TapLink SA</g:brand>
      <g:google_product_category>922</g:google_product_category>
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>25 SAR</g:price>
      </g:shipping>
    </item>`;
}

// تنظيف العنوان
function cleanTitle(title) {
  return title
    .replace(/&[a-zA-Z0-9#]+;/g, '') // إزالة HTML Entities
    .replace(/[^\w\u0600-\u06FF\s\-]/g, '') // إزالة الرموز الخطرة
    .trim()
    .substring(0, 150);
}

// تنظيف الوصف
function cleanDescription(description) {
  if (!description) return 'منتج عالي الجودة من تاب لينك السعودية';
  
  return description
    .replace(/<[^>]*>/g, '') // إزالة HTML Tags
    .replace(/&[a-zA-Z0-9#]+;/g, '') // إزالة HTML Entities
    .replace(/\s+/g, ' ') // إزالة المسافات الزائدة
    .trim()
    .substring(0, 2000); // قص الوصف
}
