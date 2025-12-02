// components/seo/ProductSchema.js
import Head from 'next/head';

export default function ProductSchema({ product }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taplinksa.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => img.src) || [],
    "description": (product.short_description || product.description || '')
      .replace(/<[^>]*>?/gm, '')
      .trim(),
    
    "sku": product.sku,
    "mpn": product.mpn || product.id,
    "gtin13": product.gtin || undefined,

    "brand": {
      "@type": "Brand",
      "name": "TapLink SA"
    },

    "itemCondition": "https://schema.org/NewCondition",

    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop/${product.slug}`,
      "priceCurrency": "SAR",
      "price": product.price,
      "availability": product.stock_status === "instock"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "TapLink SA"
      }
    }
  };

  // إضافة Aggregate Rating
  if (product.average_rating && product.rating_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.average_rating,
      "reviewCount": product.rating_count
    };
  }

  // إضافة مراجعات فعلية إذا موجودة
  if (product.reviews?.length > 0) {
    schema.review = product.reviews.map(r => ({
      "@type": "Review",
      "author": r.reviewer,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating
      },
      "reviewBody": r.review
    }));
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
