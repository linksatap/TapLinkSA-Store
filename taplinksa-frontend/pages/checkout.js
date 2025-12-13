import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import CouponInput from '../components/CouponInput';

export default function Checkout() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    postcode: '',
    address: '',
    notes: '',
  });

  // تعبئة بيانات المستخدم عند تسجيل الدخول
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // حساب الشحن عند تغيير الرمز البريدي
  useEffect(() => {
    if (formData.postcode && cart.length > 0) {
      calculateShipping();
    }
  }, [formData.postcode, cart]);

  // ✅ حساب الإجماليات بشكل صحيح
  const subtotal = getCartTotal();
  
  // ✅ قيمة الخصم من الكوبون
  const discount = appliedCoupon?.discountAmount || 0;
  
  const shippingCost = shippingInfo ? shippingInfo.cost : 0;
  
  // ✅ رسوم الدفع عند الاستلام
  const codFee = paymentMethod === 'cod' ? 10 : 0;
  
  // ✅ حساب الإجمالي بعد الخصم (بدون ضريبة)
  const subtotalAfterDiscount = subtotal - discount;
  const subtotalWithFees = subtotalAfterDiscount + shippingCost + codFee;
  const vat = 0; // الضريبة معطلة
  const finalTotal = subtotalWithFees + vat;
  
  // تحويل للدولار (للPayPal)
  const SAR_TO_USD = 0.2667;
  const finalTotalUSD = (finalTotal * SAR_TO_USD).toFixed(2);

  // تطبيق الكوبون
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    console.log('✅ Coupon applied:', coupon);
  };

  // حساب الشحن
  const calculateShipping = async () => {
    if (!formData.postcode) {
      setShippingInfo(null);
      return;
    }

    try {
      const items = cart.map(item => ({
        id: item.id,
        virtual: item.virtual,
        downloadable: item.downloadable,
        quantity: item.quantity
      }));

      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postcode: formData.postcode,
          items,
          subtotal: subtotalAfterDiscount // ✅ استخدام المجموع بعد الخصم
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShippingInfo(data.shipping);
      } else {
        setShippingInfo(null);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      setShippingInfo(null);
    }
  };

  // إرسال الطلب لووكميرس
  const sendOrderToWooCommerce = async (orderData) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify({
          orderData: {
            ...orderData,
            customer_id: user?.id || 0,
            // ✅ إضافة الكوبون
            coupon_lines: appliedCoupon ? [{
              code: appliedCoupon.code,
              discount: discount.toFixed(2)
            }] : [],
            // ✅ إضافة رسوم COD كـ Fee Line
            fee_lines: codFee > 0 ? [{
              name: 'رسوم الدفع عند الاستلام',
              total: codFee.toFixed(2),
              tax_status: 'none'
            }] : []
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Order created in WooCommerce:', result.orderId);
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      return null;
    }
  };

  // تغيير بيانات الفورم
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        postcode: formData.postcode,
        address: formData.address,
        notes: formData.notes,
        paymentMethod,
        paid: false,
        items: cart,
        customer_id: user?.id || 0,
        coupon_code: appliedCoupon?.code || '',
        discount: discount, // ✅ قيمة الخصم
        cod_fee: codFee, // ✅ رسوم COD
        shipping: shippingCost, // ✅ رسوم الشحن
        vat, // ✅ الضريبة (0)
        finalTotal, // ✅ الإجمالي النهائي
      };

      console.log('📦 Order Data:', orderData);

      const result = await sendOrderToWooCommerce(orderData);
      clearCart();

      if (result) {
        router.push(`/thank-you?payment=${paymentMethod}&order_id=${result.orderId}&order_number=${result.orderNumber}`);
      } else {
        router.push(`/thank-you?payment=${paymentMethod}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  // ✅ التحقق من وجود منتجات في السلة
  if (cart.length === 0) {
    return (
      <Layout title="السلة فارغة | تاب لينك السعودية">
        <div className="container-custom section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold mb-4">سلة التسوق فارغة</h2>
            <p className="text-gray-600 mb-8">لا توجد منتجات في سلتك حالياً</p>
            <Link
              href="/shop"
              className="inline-block bg-gold text-dark font-bold px-8 py-3 rounded-xl hover:bg-yellow-500 transition-all"
            >
              تصفح المنتجات
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="إتمام الطلب | تاب لينك السعودية">
      <div className="container-custom section-padding">

        {/* المسار العلوي */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="text-gray-600 hover:text-gold transition-colors">الرئيسية</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/shop" className="text-gray-600 hover:text-gold transition-colors">المتجر</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/cart" className="text-gray-600 hover:text-gold transition-colors">السلة</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">الدفع</li>
          </ol>
        </nav>

        {/* العنوان */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            إتمام الطلب
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </motion.div>

        {/* رسالة تسجيل الدخول */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
          >
            <p className="text-green-800 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>
                مرحباً <strong>{user.name}</strong>! بياناتك محفوظة وسيتم ربط الطلب بحسابك تلقائياً.
              </span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <p className="text-blue-800 flex items-start gap-2">
              <span className="text-2xl">💡</span>
              <span>
                لديك حساب؟{' '}
                <Link 
                  href={`/login?redirect=/checkout`} 
                  className="text-blue-600 font-bold underline hover:text-blue-800 transition-colors"
                >
                  سجل دخولك
                </Link>{' '}
                لحفظ الطلب في حسابك وتتبعه لاحقاً.
              </span>
            </p>
          </motion.div>
        )}

        {/* بداية تخطيط الصفحة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* العمود الأيسر – بيانات العميل والفورم */}
          <div className="lg:col-span-2 space-y-6">
            <CheckoutForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              shippingInfo={shippingInfo}
              finalTotal={finalTotal}
              finalTotalUSD={finalTotalUSD}
              user={user}
              cart={cart}
              codFee={codFee} // ✅ تمرير رسوم COD
            />

            {/* إدخال الكوبون */}
            <CouponInput
              onApplyCoupon={handleApplyCoupon}
              subtotal={subtotal}
            />
          </div>

          {/* العمود الأيمن — ملخص الطلب */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              cart={cart}
              subtotal={subtotal}
              discount={discount} // ✅ تمرير قيمة الخصم
              shippingInfo={shippingInfo}
              finalTotal={finalTotal}
              finalTotalUSD={finalTotalUSD}
              appliedCoupon={appliedCoupon}
              paymentMethod={paymentMethod}
              codFee={codFee} // ✅ تمرير رسوم COD
            />
          </div>

        </div>

        {/* ✅ Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔒</span>
              <div>
                <h3 className="font-bold text-lg mb-1">معاملات آمنة ومشفرة</h3>
                <p className="text-sm text-gray-600">
                  جميع معلوماتك محمية بتقنية SSL والتشفير من طرف إلى طرف
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>دفع آمن</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>حماية البيانات</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>خصوصية مضمونة</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
