import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";

// تحميل AOS فقط في المتصفح
const AOSInit = dynamic(() => import("@/components/common/AOSInit"), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <AOSInit />
      <UserProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </UserProvider>
    </>
  );
}
