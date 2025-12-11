import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';

export default function Layout({
  children,
  title = 'متجر تاب لينك',
  description = 'بطاقات NFC الذكية وحلول التسويق الرقمي في المملكة...',
  keywords = 'بطاقات NFC, بطاقات ذكية, تسويق رقمي, بريدة',
  ogImage = '/og-image.jpg',
  canonical
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = canonical || `${siteUrl}${cleanPath}`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href={canonicalUrl} hreflang="ar-sa" />

        {/* Favicons */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#111827" />

        {/* OG */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="متجر تاب لينك" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`}
        />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'متجر تاب لينك',
              image: `${siteUrl}/og-image.jpg`,
              '@id': siteUrl,
              url: siteUrl,
              telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Buraydah',
                addressRegion: 'Qassim',
                addressCountry: 'SA',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 26.326,
                longitude: 43.975,
              },
              sameAs: [
                'https://instagram.com/taplinksa',
                'https://twitter.com/taplinksa'
              ]
            })
          }}
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
