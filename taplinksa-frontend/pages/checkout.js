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

  const subtotal = getCartTotal();
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingCost = shippingInfo ? shippingInfo.cost : 0;
  const finalTotal = subtotal - discount + shippingCost;
  const SAR_TO_USD = 0.2667;
  const finalTotalUSD = (finalTotal * SAR_TO_USD).toFixed(2);

  // تطبيق الكوبون
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
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
          subtotal
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
            coupon_lines: appliedCoupon
              ? [{ code: appliedCoupon.code }]
              : [],
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Order created in WooCommerce:', result.orderId);
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('تم إرسال الطلب عبر واتساب، لكن حدث خطأ في حفظ الطلب في النظام');
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
        paid: paymentMethod === 'paid',
        items: cart,
        customer_id: user?.id || 0,
        coupon_code: appliedCoupon?.code || '',
      };

      const result = await sendOrderToWooCommerce(orderData);
      clearCart();

      if (result) {
        router.push(`/thank-you?payment=${paymentMethod}&order_id=${result.orderId}&order_number=${result.orderNumber}`);
      } else {
        router.push(`/thank-you?payment=${paymentMethod}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="إتمام الطلب | تاب لينك السعودية">
      <div className="container-custom section-padding">

        {/* المسار العلوي */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="text-gray-600 hover:text-gold">الرئيسية</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/shop" className="text-gray-600 hover:text-gold">المتجر</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/cart" className="text-gray-600 hover:text-gold">السلة</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">الدفع</li>
          </ol>
        </nav>

        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            إتمام الطلب
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        {/* رسالة تسجيل الدخول */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
          >
            <p className="text-green-800">
              ✅ مرحباً <strong>{user.name}</strong>! بياناتك محفوظة وسيتم ربط الطلب بحسابك تلقائياً.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <p className="text-blue-800">
              💡 لديك حساب؟{' '}
              <Link href={`/login?redirect=/checkout`} className="text-blue-600 font-bold underline">
                سجل دخولك
              </Link>{' '}
              لحفظ الطلب في حسابك وتتبعه لاحقاً.
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
              discount={discount}
              shippingInfo={shippingInfo}
              finalTotal={finalTotal}
              finalTotalUSD={finalTotalUSD}
              appliedCoupon={appliedCoupon}
              paymentMethod={paymentMethod}
            />
          </div>

        </div>
      </div>
    </Layout>
  );
}