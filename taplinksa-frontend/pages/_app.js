import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

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
    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <UserProvider>
      <PayPalScriptProvider options={paypalOptions}>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </PayPalScriptProvider>
    </UserProvider>
  );
}

export default MyApp;
