import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        {/* ✅ Main favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        
        {/* ✅ PNG versions (الأهم!) */}
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/favicon-128x128.png" sizes="128x128" type="image/png" />
        
        {/* ✅ SVG version (لو عندك) */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* ✅ Apple touch icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        
        {/* ✅ Android chrome */}
        <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" type="image/png" />
        
        {/* ✅ Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* ✅ Theme colors */}
        <meta name="theme-color" content="#2180803d" />
        <meta name="msapplication-TileColor" content="#2180803d" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* ✅ Other head tags */}
        <meta name="theme-color" content="#111827" />

        {/* تحسين الأداء - فقط الأساسيات */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* أيقونة 
        <link rel="icon" href="/favicon.ico" />*/}

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
