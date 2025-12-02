import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Layout({
  children,
  title = 'تاب لينك السعودية',
  description = 'بطاقات NFC الذكية وحلول الحضور الرقمي في القصيم',
  keywords = 'NFC, بطاقات ذكية, TapLink SA, حضور رقمي, حلول رقمية, القصيم السعودية ,كوبونات,خصومات',
  ogImage = '/og-image.jpg',
  noindex = false,
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const canonicalUrl = `${siteUrl}${router.asPath.split('?')[0]}`;

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "TapLink SA",
    image: `${siteUrl}${ogImage}`,
    "@id": siteUrl,
    url: siteUrl,
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buraydah",
      addressRegion: "Qassim",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.3260,
      longitude: 43.9750,
    },
    sameAs: [
      "https://instagram.com/taplinksa",
      "https://twitter.com/taplinksa"
    ]
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}

        <link rel="canonical" href={canonicalUrl} />

        {noindex && <meta name="robots" content="noindex,nofollow" />}

        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}${ogImage}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </Head>

      {children}
    </>
  );
}
