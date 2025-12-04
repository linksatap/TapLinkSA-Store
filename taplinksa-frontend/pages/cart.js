import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <Layout title="السلة | تاب لينك السعودية">
        <div className="container-custom section-padding">
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-8xl mb-6"
            >
              🛒
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">السلة فارغة</h1>
            <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات للسلة بعد</p>
            <Link href="/shop" className="btn-primary">
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="السلة | تاب لينك السعودية">
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="text-gray-600 hover:text-gold">الرئيسية</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/shop" className="text-gray-600 hover:text-gold">المتجر</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">السلة</li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            سلة التسوق
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* قائمة المنتجات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  {/* صورة المنتج */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.images?.[0]?.src || '/placeholder-product.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* معلومات المنتج */}
                  <div className="flex-grow">
                    <Link href={`/shop/${item.slug}`}>
                      <h3 className="text-lg font-bold hover:text-gold transition-colors mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gold font-bold text-xl mb-3">
                      {parseFloat(item.price)} ر.س
                    </p>

                    {/* التحكم في الكمية */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        −
                      </button>
                      <span className="font-bold min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* المجموع وزر الحذف */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="إزالة من السلة"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <div className="text-left text-xl font-bold text-gold">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} ر.س
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* زر إفراغ السلة */}
            <div className="mt-4">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                إفراغ السلة
              </button>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{total.toFixed(2)} ر.س</span>
                </div>{/* الضريبة 
                <div className="flex justify-between text-gray-600">
                  <span>الضريبة (15%)</span>
                  <span className="font-bold">{(total * 0.15).toFixed(2)} ر.س</span>
                </div>*/}
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="font-bold text-green-600">مجاني</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-gold">{(total * 1.15).toFixed(2)} ر.س</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="btn-primary w-full mb-3"
              >
                إتمام الطلب
              </button>

              <Link href="/shop" className="btn-secondary w-full block text-center">
                متابعة التسوق
              </Link>

              {/* معلومات إضافية */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>شحن مجاني لجميع الطلبات</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>دفع آمن ومضمون</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>إمكانية الإرجاع خلال 14 يوم</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
