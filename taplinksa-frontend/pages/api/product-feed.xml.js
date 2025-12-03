// pages/api/product-feed.xml.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log('🔄 Generating Google Merchant Feed...');
    
    // 1. جلب المنتجات من WooCommerce
    const products = await fetchAllProducts();
    
    if (!products || products.length === 0) {
      throw new Error('No products found');
    }

    console.log(`✅ Found ${products.length} products`);

    // 2. إنشاء XML Feed محسّن
    const feed = generateOptimizedFeed(products);

    // 3. إرجاع XML مع Headers صحيحة
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(feed);
    
    console.log('✅ Feed generated successfully');
    
  } catch (error) {
    console.error('❌ Error generating feed:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate feed',
      message: error.message 
    });
  }
}

// ===============================
// 1. جلب جميع المنتجات
// ===============================
async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
        {
          params: {
            per_page: 100,
            page,
            status: 'publish',
            stock_status: 'instock',
          },
          auth: {
            username: process.env.WC_CONSUMER_KEY,
            password: process.env.WC_CONSUMER_SECRET,
          },
          timeout: 30000, // 30 seconds
        }
      );

      const products = response.data;
      allProducts.push(...products);

      // فحص إذا كان هناك صفحات أخرى
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;
      
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      hasMore = false;
    }
  }

  return allProducts;
}

// ===============================
// 2. إنشاء Feed محسّن
// ===============================
function generateOptimizedFeed(products) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>تاب لينك السعودية - منتجات</title>
    <link>${siteUrl}</link>
    <description>بطاقات NFC الذكية وحلول التسويق الرقمي في السعودية</description>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <language>ar-SA</language>
${products.map(product => generateProductItem(product, siteUrl)).join('\n')}
  </channel>
</rss>`;
}

// ===============================
// 3. توليد عنصر المنتج المحسّن
// ===============================
function generateProductItem(product, siteUrl) {
  // البيانات الأساسية
  const id = product.id;
  const sku = product.sku || `TAPLINK-${id}`;
  
  // العنوان المحسّن (أول 150 حرف)
  const title = optimizeTitle(product);
  
  // الوصف المحسّن (أول 5000 حرف)
  const description = optimizeDescription(product);
  
  // الروابط
  const link = `${siteUrl}/product/${product.slug}`;
  const mobileLink = link; // نفس الرابط للموبايل
  
  // الصور المحسّنة
  const imageLink = optimizeImage(product.images[0]?.src);
  const additionalImages = product.images
    .slice(1, 11) // حتى 10 صور إضافية
    .map(img => optimizeImage(img.src))
    .filter(Boolean);
  
  // السعر والعملة
  const price = `${parseFloat(product.price).toFixed(2)} SAR`;
  const salePrice = product.sale_price 
    ? `${parseFloat(product.sale_price).toFixed(2)} SAR` 
    : '';
  
  // التوفر
  const availability = getAvailability(product);
  
  // الحالة
  const condition = 'new';
  
  // العلامة التجارية
  const brand = getBrand(product);
  
  // GTIN & MPN
  const gtin = getGTIN(product);
  const mpn = getMPN(product);
  
  // Google Product Category
  const googleCategory = getGoogleCategory(product);
  
  // Product Type (التصنيف الداخلي)
  const productType = getProductType(product);
  
  // الشحن
  const shipping = getShipping(product);
  
  // الضرائب (VAT 15% في السعودية)
  const taxRate = '15';
  
  // اللون والحجم (إن وجد)
  const color = getAttribute(product, 'color') || getAttribute(product, 'اللون');
  const size = getAttribute(product, 'size') || getAttribute(product, 'الحجم');
  
  // Custom Labels للتصفية
  const customLabel0 = getCustomLabel0(product); // الفئة الرئيسية
  const customLabel1 = product.featured ? 'مميز' : 'عادي';
  const customLabel2 = product.on_sale ? 'عرض خاص' : 'سعر عادي';

  return `    <item>
      <g:id>${id}</g:id>
      ${sku ? `<g:sku>${escapeXml(sku)}</g:sku>` : ''}
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:mobile_link>${mobileLink}</g:mobile_link>
      <g:image_link>${imageLink}</g:image_link>
      ${additionalImages.map((img, i) => `<g:additional_image_link>${img}</g:additional_image_link>`).join('\n      ')}
      <g:price>${price}</g:price>
      ${salePrice ? `<g:sale_price>${salePrice}</g:sale_price>` : ''}
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      ${gtin ? `<g:gtin>${gtin}</g:gtin>` : `<g:identifier_exists>no</g:identifier_exists>`}
      ${mpn ? `<g:mpn>${escapeXml(mpn)}</g:mpn>` : ''}
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type>${escapeXml(productType)}</g:product_type>
      ${color ? `<g:color>${escapeXml(color)}</g:color>` : ''}
      ${size ? `<g:size>${escapeXml(size)}</g:size>` : ''}
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>${shipping.service}</g:service>
        <g:price>${shipping.price}</g:price>
      </g:shipping>
      <g:tax>
        <g:country>SA</g:country>
        <g:rate>${taxRate}</g:rate>
      </g:tax>
      <g:custom_label_0>${escapeXml(customLabel0)}</g:custom_label_0>
      <g:custom_label_1>${customLabel1}</g:custom_label_1>
      <g:custom_label_2>${customLabel2}</g:custom_label_2>
    </item>`;
}

// ===============================
// 4. دوال التحسين
// ===============================

// تحسين العنوان
function optimizeTitle(product) {
  let title = product.name;
  
  // إضافة الفئة إذا لم تكن موجودة
  const category = product.categories[0]?.name;
  if (category && !title.includes(category)) {
    title = `${title} | ${category}`;
  }
  
  // إضافة العلامة التجارية
  if (!title.toLowerCase().includes('taplink')) {
    title += ' - تاب لينك';
  }
  
  // قص العنوان إلى 150 حرف
  return title.substring(0, 150);
}

// تحسين الوصف
function optimizeDescription(product) {
  let desc = stripHtml(product.description || product.short_description || product.name);
  
  // إضافة معلومات إضافية
  const extras = [];
  
  if (product.on_sale) {
    extras.push('✨ عرض خاص');
  }
  
  if (product.shipping_class === 'free-shipping') {
    extras.push('📦 شحن مجاني');
  }
  
  extras.push('✅ منتج أصلي 100%');
  extras.push('🇸🇦 توصيل لجميع مدن السعودية');
  extras.push('💳 الدفع عند الاستلام متاح');
  
  // دمج الوصف مع المعلومات
  desc = `${desc}\n\n${extras.join(' | ')}`;
  
  // قص الوصف إلى 5000 حرف
  return desc.substring(0, 5000);
}

// تحسين الصورة
function optimizeImage(imageUrl) {
  if (!imageUrl) return '';
  
  // إزالة معاملات الحجم القديمة
  let optimized = imageUrl.split('?')[0];
  
  // إضافة حجم محسّن (1200×1200)
  if (!optimized.includes('-scaled')) {
    optimized += '?w=1200&h=1200&fit=crop';
  }
  
  return optimized;
}

// التوفر
function getAvailability(product) {
  if (product.stock_status === 'instock') {
    return 'in stock';
  } else if (product.stock_status === 'onbackorder') {
    return 'backorder';
  } else {
    return 'out of stock';
  }
}

// العلامة التجارية
function getBrand(product) {
  // محاولة الحصول على Brand من Meta Data
  const brandMeta = product.meta_data?.find(m => 
    m.key === '_brand' || m.key === 'brand' || m.key === '_yoast_wpseo_brand'
  );
  
  return brandMeta?.value || 'TapLink SA';
}

// GTIN (Barcode)
function getGTIN(product) {
  const gtinMeta = product.meta_data?.find(m => 
    m.key === '_gtin' || m.key === 'gtin' || m.key === '_wc_gtin'
  );
  
  return gtinMeta?.value || '';
}

// MPN (Model Number)
function getMPN(product) {
  const mpnMeta = product.meta_data?.find(m => 
    m.key === '_mpn' || m.key === 'mpn' || m.key === 'model_number'
  );
  
  return mpnMeta?.value || product.sku || '';
}

// Google Product Category
function getGoogleCategory(product) {
  const categories = product.categories || [];
  
  const categoryMap = {
    'nfc-cards': '922 - Electronics > Electronics Accessories',
    'بطاقات-nfc': '922 - Electronics > Electronics Accessories',
    'subscriptions': '313 - Software > Computer Software',
    'اشتراكات': '313 - Software > Computer Software',
    'services': '2092 - Business & Industrial > Business Services',
    'خدمات': '2092 - Business & Industrial > Business Services',
  };
  
  for (const cat of categories) {
    if (categoryMap[cat.slug]) {
      return categoryMap[cat.slug];
    }
  }
  
  return '922 - Electronics'; // Default
}

// Product Type (التصنيف الداخلي)
function getProductType(product) {
  const categories = product.categories || [];
  return categories.map(c => c.name).join(' > ') || 'منتجات عامة';
}

// الشحن
function getShipping(product) {
  const shippingClass = product.shipping_class;
  
  if (shippingClass === 'free-shipping' || shippingClass === 'شحن-مجاني') {
    return {
      service: 'Standard',
      price: '0 SAR',
    };
  }
  
  // شحن عادي
  return {
    service: 'Standard',
    price: '25 SAR',
  };
}

// Custom Label 0 (الفئة الأساسية)
function getCustomLabel0(product) {
  const categories = product.categories || [];
  return categories[0]?.name || 'عام';
}

// الحصول على Attribute
function getAttribute(product, attributeName) {
  const attr = product.attributes?.find(a => 
    a.name.toLowerCase() === attributeName.toLowerCase()
  );
  
  return attr?.options?.[0] || '';
}

// إزالة HTML
function stripHtml(html) {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Escape XML
function escapeXml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
