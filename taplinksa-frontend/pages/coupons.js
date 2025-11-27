import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

export default function CouponsPage() {  // ✅ تأكد من هذا السطر
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      const data = await response.json();
      setCoupons(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } else {
      // Fallback: prompt user to copy manually
      window.prompt('انسخ الكود:', code);
    }
  };

  const getDiscountText = (coupon) => {
    if (coupon.discount_type === 'percent') {
      return `خصم ${coupon.amount}%`;
    } else {
      return `خصم ${coupon.amount} ر.س`;
    }
  };

  return (  // ✅ تأكد من وجود return
    <Layout title="كوبونات الخصم المتاحة">
      <div className="bg-gray-50 min-h-screen pt-32 pb-12">
        <div className="container-custom">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-bold text-dark mb-4">
              🎟️ كوبونات الخصم
            </h1>
            <p className="text-xl text-gray-600">
              استخدم الكوبونات واحصل على خصومات رائعة!
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-bounce">⏳</div>
              <p className="text-xl text-gray-600">جاري تحميل الكوبونات...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🎫</div>
              <h2 className="text-3xl font-bold text-dark mb-4">
                لا توجد كوبونات متاحة حالياً
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                تابعنا على وسائل التواصل للحصول على أحدث العروض!
              </p>
              <Link href="/shop" className="btn-primary inline-block">
                تصفح المتجر
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gold via-yellow-400 to-yellow-500 rounded-2xl shadow-xl overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-dark/10 rounded-bl-full"></div>
                  
                  <div className="p-8">
                    <div className="inline-block bg-dark text-gold px-6 py-3 rounded-full font-bold text-2xl mb-4 shadow-lg">
                      {getDiscountText(coupon)}
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">كود الخصم:</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-2xl font-bold text-dark font-mono">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className="px-4 py-2 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all text-sm"
                        >
                          {copiedCode === coupon.code ? '✓ تم' : '📋 نسخ'}
                        </button>
                      </div>
                    </div>

                    {coupon.description && (
                      <p className="text-dark/80 mb-4 text-sm">
                        {coupon.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-dark/70">
                      {coupon.minimum_amount && (
                        <p>📊 الحد الأدنى: {coupon.minimum_amount} ر.س</p>
                      )}
                      
                      {coupon.free_shipping && (
                        <p className="text-green-700 font-bold">🚚 شحن مجاني</p>
                      )}
                      
                      {coupon.date_expires && (
                        <p>📅 ينتهي: {new Date(coupon.date_expires).toLocaleDateString('ar-SA')}</p>
                      )}
                      
                      {coupon.usage_limit && (
                        <p>
                          🎫 متبقي: {coupon.usage_limit - (coupon.usage_count || 0)} استخدام
                        </p>
                      )}
                    </div>

                    <Link
                      href="/checkout"
                      className="block mt-6 py-3 bg-dark text-gold font-bold text-center rounded-xl hover:bg-dark/90 transition-all shadow-lg"
                    >
                      استخدم الآن →
                    </Link>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-2 bg-dark/20"></div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}  // ✅ تأكد من إغلاق الدالة والأقواس
