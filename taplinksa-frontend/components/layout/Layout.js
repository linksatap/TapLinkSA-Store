import Head from 'next/head';
import { useRouter } from 'next/router'; // استيراد useRouter
import Header from './Header';
import Footer from './Footer';

export default function Layout({ 
  children, 
  title = 'متجر تاب لينك ',
  description = 'بطاقات NFC الذكية وحلول التسويق الرقمي في المملكة... ',
  keywords = 'بطاقات NFC, بطاقات ذكية, تسويق رقمي, بريدة',
  ogImage = '/og-image.jpg',
  canonical
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';
  const canonicalUrl = canonical || `${siteUrl}${router.asPath}`;

  return (
    <>
      <Head>
        <title>متجر تاب لينك</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang */}
        <link rel="alternate" href={canonicalUrl} hreflang="ar-sa" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage.startsWith('http' ) ? ogImage : `${siteUrl}${ogImage}`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="متجر تاب لينك" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage.startsWith('http' ) ? ogImage : `${siteUrl}${ogImage}`} />
        
        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'متجر تاب لينك ',
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
                latitude: 26.3260,
                longitude: 43.9750,
              },
              sameAs: [
                'https://instagram.com/taplinksa',
                'https://twitter.com/taplinksa',
              ],
            } ),
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