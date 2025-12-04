// components/seo/BreadcrumbSchema.js
import Head from 'next/head';

export default function BreadcrumbSchema({ items }) {
  // ✅ التحقق من وجود عناصر
  if (!items || items.length === 0) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      // آخر عنصر لا يحتوي على رابط
      ...(item.url && { "item": `${siteUrl}${item.url}` })
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
    </Head>
  );
}
