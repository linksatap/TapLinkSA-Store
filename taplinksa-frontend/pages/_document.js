/**
 * _document.js - Enhanced for Performance
 * ملف الوثيقة الرئيسي مع تحسينات الأداء
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        {/* ========================================
            Preconnect & DNS Prefetch
        ======================================== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cms.taplinksa.com" />
        
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.paypal.com" />
        
        {/* ========================================
            Preload Critical Resources
        ======================================== */}
        {/* يمكنك إضافة preload للخطوط الأساسية هنا إذا كانت محلية */}
        {/* <link
          rel="preload"
          href="/fonts/Cairo-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Cairo-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        /> */}
        
        {/* ========================================
            Favicon & App Icons
        ======================================== */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* ========================================
            Theme & App Configuration
        ======================================== */}
        <meta name="theme-color" content="#FBBF24" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TapLink SA" />
        <meta name="application-name" content="TapLink SA" />
        <meta name="msapplication-TileColor" content="#FBBF24" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* ========================================
            Security Headers
        ======================================== */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* ========================================
            Resource Hints
        ======================================== */}
        <link rel="prefetch" href="/shop" />
        <link rel="prefetch" href="/services" />
      </Head>
      <body>
        {/* Noscript Fallback */}
        <noscript>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            fontFamily: 'Arial, sans-serif',
          }}>
            <strong>تنبيه:</strong> يتطلب هذا الموقع تفعيل JavaScript للعمل بشكل صحيح.
          </div>
        </noscript>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
