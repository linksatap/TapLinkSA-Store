/**
 * _app.js - Enhanced for Performance & SEO
 * ملف التطبيق الرئيسي مع تحسينات الأداء والتتبع
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from '../components/analytics/GoogleAnalytics';
import { trackPageView } from '../lib/analytics';

// تحميل AOS بشكل ديناميكي فقط في المتصفح
const AOSInit = dynamic(() => import('../components/common/AOSInit'), {
  ssr: false,
  loading: () => null,
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // تتبع تغيير الصفحات في Google Analytics
  useEffect(() => {
    const handleRouteChange = (url) => {
      trackPageView(url, document.title);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // إعدادات PayPal
  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: 'USD',
    intent: 'capture',
    components: 'buttons,funding-eligibility',
    'enable-funding': 'paylater,venmo',
  };

  return (
    <>
      {/* Google Analytics 4 */}
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      
      {/* AOS Animation Library */}
      <AOSInit />
      
      {/* Providers */}
      <UserProvider>
        <PayPalScriptProvider options={paypalOptions}>
          <CartProvider>
            <Component {...pageProps} />
            
            {/* Vercel Speed Insights */}
            <SpeedInsights />
          </CartProvider>
        </PayPalScriptProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
