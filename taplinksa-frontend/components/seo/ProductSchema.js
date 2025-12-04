// components/seo/ProductSchema.js
import Head from 'next/head';

export default function ProductSchema({ product }) {
  // ✅ التحقق من وجود المنتج
  if (!product) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taplinksa.com";

  // ✅ تنظيف الوصف
  const cleanDescription = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500); // ✅ حد أقصى 500 حرف
  };

  // ✅ تاريخ انتهاء السعر (سنة من الآن)
  const getPriceValidUntil = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    
    // ✅ صور مع fallback
    "image": product.images?.length > 0
      ? product.images.map(img => img.src)
      : [`${siteUrl}/images/placeholder-nfc.jpg`],
    
    "description": cleanDescription(product.short_description || product.description),
    
    // ✅ SKU و MPN
    "sku": product.sku || `TAPLINK-${product.id}`,
    "mpn": product.mpn || product.id.toString(),
    
    // ✅ GTIN فقط إذا موجود
    ...(product.gtin && { "gtin13": product.gtin }),
    
    "brand": {
      "@type": "Brand",
      "name": "TapLink SA"
    },
    
    "itemCondition": "https://schema.org/NewCondition",
    
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop/${product.slug}`,
      "priceCurrency": "SAR",
      "price": parseFloat(product.price).toFixed(2), // ✅ تنسيق السعر
      "priceValidUntil": getPriceValidUntil(), // ✅ مهم جداً
      "availability": product.stock_status === "instock"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "TapLink SA",
        "url": siteUrl
      }
    }
  };

  // ✅ سعر العرض إذا موجود
  if (product.on_sale && product.sale_price) {
    schema.offers.price = parseFloat(product.sale_price).toFixed(2);
  }

  // ✅ Aggregate Rating
  if (product.average_rating && product.rating_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(product.average_rating).toFixed(1),
      "reviewCount": product.rating_count,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // ✅ Reviews محسّنة
  if (product.reviews?.length > 0) {
    schema.review = product.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.reviewer || "عميل" // ✅ fallback
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": r.review || "",
      "datePublished": r.date_created || new Date().toISOString()
    }));
  }

  // ✅ إضافة Category إذا موجودة
  if (product.categories?.length > 0) {
    schema.category = product.categories[0].name;
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }} // ✅ مسافات للقراءة
      />
    </Head>
  );
}
