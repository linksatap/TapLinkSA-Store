import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
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

  // إنشاء طلب PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: finalTotalUSD,
            currency_code: 'USD',
          },
          description: `TapLink Order - ${cart.length} items`,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });
  };

  // عند الموافقة على الدفع PayPal
  const onApprove = async (data, actions) => {
    setLoading(true);

    try {
      const details = await actions.order.capture();

      const orderData = {
        name: formData.name || `${details.payer.name.given_name} ${details.payer.name.surname}`,
        email: formData.email || details.payer.email_address,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        postcode: formData.postcode,
        address: formData.address,
        notes: formData.notes,
        paymentMethod: 'paypal',
        paid: true,
        paypalOrderId: details.id,
        items: cart,
        customer_id: user?.id || 0,
        coupon_code: appliedCoupon?.code || '',
      };

      const result = await sendOrderToWooCommerce(orderData);

      clearCart();

      if (result) {
        router.push(`/thank-you?payment=paypal&order_id=${result.orderId}&order_number=${result.orderNumber}`);
      } else {
        router.push(`/thank-you?payment=paypal&order_id=${details.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  // عند حدوث خطأ PayPal
  const onError = (err) => {
    console.error('PayPal Error:', err);
    alert('حدث خطأ في الدفع عبر PayPal. يرجى المحاولة مرة أخرى.');
  };
  // بدء واجهة المستخدم
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

          {/* العمود الأيسر – بيانات العميل */}
          <div className="lg:col-span-2 space-y-6">

            {/* نموذج البيانات */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold mb-6">بيانات التوصيل</h2>

              <div className="space-y-4 mb-8">

                {/* الاسم */}
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* الهاتف + البريد */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الجوال *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                      placeholder="05xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={!!user}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 
                        focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all 
                        ${user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                {/* المنطقة + المدينة + الرمز البريدي */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">المنطقة *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300"
                      placeholder="مثال: القصيم"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">المدينة *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300"
                      placeholder="مثال: بريدة"
                    />
                  </div>

                  {/* الرمز البريدي */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الرمز البريدي *
                      <span className="text-red-500 text-xs mr-1">(إلزامي)</span>
                    </label>

                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                      maxLength="5"
                      pattern="[0-9]{5}"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gold 
                        focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none 
                        font-mono text-lg"
                      placeholder="51431"
                    />

                    <p className="text-xs text-gray-500 mt-1">5 أرقام فقط - مطلوب لحساب الشحن</p>
                  </div>
                </div>

                {/* إذا ما دخل الرمز البريدي */}
                {!formData.postcode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4"
                  >
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>الرمز البريدي مطلوب</strong> لحساب تكلفة الشحن
                    </p>
                  </motion.div>
                )}

                {/* العنوان */}
                <div>
                  <label className="block text-sm font-medium mb-2">العنوان التفصيلي *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"
                    placeholder="الحي، الشارع، رقم المبنى..."
                  ></textarea>
                </div>

                {/* معلومات الشحن */}
                {shippingInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`rounded-lg p-4 border-2 ${
                      shippingInfo.cost === 0
                        ? 'bg-green-50 border-green-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-dark">
                          🚚 {shippingInfo.zoneName || shippingInfo.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          الرمز البريدي: {formData.postcode} • {shippingInfo.deliveryTime || 'توصيل سريع'}
                        </p>
                      </div>

                      <div className="text-left">
                        {shippingInfo.cost === 0 ? (
                          <span className="text-2xl font-bold text-green-600">مجاني</span>
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">
                            {shippingInfo.cost} ر.س
                          </span>
                        )}
                      </div>
                    </div>

                    {shippingInfo.reason && (
                      <div className="bg-green-100 rounded-lg p-2 mt-3">
                        <p className="text-sm text-green-800">
                          🎉 <strong>{shippingInfo.reason}</strong>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ملاحظات إضافية */}
                <div>
                  <label className="block text-sm font-medium mb-2">ملاحظات إضافية</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"
                    placeholder="أي ملاحظات تخص التوصيل..."
                  ></textarea>
                </div>
              </div>

              {/* اختيار طريقة الدفع */}
              <h2 className="text-2xl font-bold mb-6">طريقة الدفع</h2>

              <div className="space-y-4 mb-8">

                {/* الدفع عند الاستلام */}
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-300 hover:border-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-bold">الدفع عند الاستلام</div>
                    <div className="text-sm text-gray-600">ادفع نقداً عند استلام الطلب</div>
                  </div>
                </label>

                {/* PayPal */}
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-300 hover:border-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-bold">PayPal</div>
                    <div className="text-sm text-gray-600">ادفع بأمان عبر PayPal</div>
                  </div>
                </label>

                {/* تحويل بنكي */}
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-300 hover:border-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <div className="flex-grow">
                    <div className="font-bold">تحويل بنكي</div>
                    <div className="text-sm text-gray-600">حوّل المبلغ لحسابنا البنكي</div>

                    {paymentMethod === 'bank' && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <div className="font-medium mb-2">معلومات الحساب البنكي:</div>
                        <div>اسم الحساب: مؤسسة تاب لينك</div>
                        <div>IBAN: SA00 0000 0000 0000 0000 0000</div>
                        <div>البنك: البنك الأهلي السعودي</div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* ملاحظة PayPal */}
              {paymentMethod === 'paypal' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    💡 <strong>ملاحظة:</strong> PayPal سيحوّل المبلغ تلقائياً من الريال السعودي إلى الدولار الأمريكي
                  </p>
                  <p className="text-sm text-blue-600">
                    المبلغ: <strong>{finalTotal.toFixed(2)} ر.س</strong> ≈ <strong>${finalTotalUSD} USD</strong>
                  </p>
                </div>
              )}
              {/* زر الدفع — PayPal */}
              {paymentMethod === 'paypal' ? (
                <div className="mt-6">
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'pay',
                    }}
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !formData.postcode}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري المعالجة...' : '✅ إكمال الطلب'}
                </button>
              )}
            </motion.form>

            {/* إدخال الكوبون */}
            <CouponInput 
              onApplyCoupon={handleApplyCoupon} 
              subtotal={subtotal}
            />
          </div>

          {/* العمود الأيمن — ملخص الطلب */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24"
            >
              <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

              {/* المنتجات */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                      <Image
                        src={item.images?.[0]?.src || '/placeholder-product.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="text-gray-600 flex-grow">
                      <div className="font-medium line-clamp-1 text-sm">{item.name}</div>
                      <div className="text-sm">الكمية: {item.quantity}</div>
                    </div>

                    <div className="font-bold text-gold whitespace-nowrap text-sm">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} ر.س
                    </div>
                  </div>
                ))}
              </div>

              {/* الأسعار */}
              <div className="space-y-3 mb-6">

                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{subtotal.toFixed(2)} ر.س</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم ({appliedCoupon.code})</span>
                    <span className="font-bold">-{discount.toFixed(2)} ر.س</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>

                  {shippingInfo ? (
                    shippingInfo.cost === 0 ? (
                      <span className="font-bold text-green-600">مجاني 🎉</span>
                    ) : (
                      <span className="font-bold">{shippingCost.toFixed(2)} ر.س</span>
                    )
                  ) : (
                    <div className="text-left">
                      <span className="text-sm text-red-500 block">أدخل الرمز البريدي</span>
                      <span className="text-xs text-gray-400">لحساب تكلفة الشحن</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-gold">{finalTotal.toFixed(2)} ر.س</span>
                </div>

                {appliedCoupon && discount > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-bold text-center">
                      🎉 وفرت {discount.toFixed(2)} ر.س!
                    </p>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-sm text-gray-500 text-center">
                    ≈ ${finalTotalUSD} USD
                  </div>
                )}
              </div>

              {/* ملاحظة تحت */}
              <div className="bg-gold/10 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  {paymentMethod === 'paypal'
                    ? 'بعد الدفع عبر PayPal سيتم إرسال تفاصيل الطلب عبر واتساب'
                    : 'وسائل الدفع الأخرى ما زالت تحت التطوير والدمج'}
                </p>
              </div>

              {/* عناصر الثقة */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>دفع آمن ومضمون</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>إمكانية الإرجاع خلال 14 يوم</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>دعم فني متاح 24/7</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
