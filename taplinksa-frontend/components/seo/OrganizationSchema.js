// components/seo/OrganizationSchema.js
import Head from 'next/head';

export default function OrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": " متجر تاب لينك",
    "alternateName": "تاب لينك السعودية",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "بطاقات NFC الذكية وحلول التسويق الرقمي في السعودية",
    
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": "القصيم",
      "addressLocality": "بريدة"
    },
    
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-50-700-4339",
      "contactType": "Customer Service",
      "areaServed": "SA",
      "availableLanguage": ["ar", "en"]
    },
    
    "sameAs": [
      "https://twitter.com/taplinksa",
      "https://instagram.com/taplinksa",
      "https://facebook.com/taplinksa"
    ]
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
