import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SpeedInsights } from "@vercel/speed-insights/next"

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }, []);

  // ✅ PayPal فقط على صفحات معينة
  const checkoutPages = ['/checkout', '/thank-you'];
  const needsPayPal = checkoutPages.includes(router.pathname);

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: 'USD',
    intent: 'capture',
    components: 'buttons,funding-eligibility',
    'enable-funding': 'paylater,venmo',
  };

  return (
    <UserProvider>
      <CartProvider>
        {needsPayPal ? (
          <PayPalScriptProvider options={paypalOptions}>
            <Component {...pageProps} />
            <SpeedInsights />
          </PayPalScriptProvider>
        ) : (
          <>
            <Component {...pageProps} />
            <SpeedInsights />
          </>
        )}
      </CartProvider>
    </UserProvider>
  );
}

export default MyApp;
