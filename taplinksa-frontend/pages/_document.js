import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Meta Tags */}
        <meta name="theme-color" content="#FBBF24" />
        <meta name="description" content="متجر تاب لينك السعودية - بطاقات NFC الذكية" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
