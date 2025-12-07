import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
//import { PayPalScriptProvider } from '@paypal/react-paypal-js';
  import { SpeedInsights } from "@vercel/speed-insights/next"

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }, []);

  const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: 'USD',
  intent: 'capture',
  components: 'buttons,funding-eligibility', // ✅ أضف funding-eligibility
  'enable-funding': 'paylater,venmo', // ✅ فعّل طرق دفع إضافية
};


  return (
    <UserProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      
    </UserProvider>
  );
}

export default MyApp;
