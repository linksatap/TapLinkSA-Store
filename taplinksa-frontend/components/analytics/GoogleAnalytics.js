/**
 * GoogleAnalytics Component
 * يضيف Google Analytics 4 (GA4) للموقع
 * يدعم: Page views, Events, E-commerce tracking
 */

import Script from 'next/script';

export default function GoogleAnalytics({ measurementId }) {
  // لا تعرض شيئاً إذا لم يكن هناك Measurement ID
  if (!measurementId) {
    console.warn('⚠️ Google Analytics Measurement ID is not provided');
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      
      {/* Google Analytics Configuration */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure',
            });
            
            // تتبع الأخطاء
            window.addEventListener('error', function(e) {
              gtag('event', 'exception', {
                description: e.message,
                fatal: false,
              });
            });
          `,
        }}
      />
    </>
  );
}
