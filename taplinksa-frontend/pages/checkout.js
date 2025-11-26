import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // ✅ أضف هذا

export default function Checkout() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useUser(); // ✅ أضف هذا
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  // ✅ تحميل بيانات المستخدم تلقائياً
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const total = getCartTotal();
  const tax = total * 0.15;
  const finalTotal = total + tax;
  
  const SAR_TO_USD = 0.2667;
  const finalTotalUSD = (finalTotal * SAR_TO_USD).toFixed(2);

  // دالة إرسال الطلب إلى WooCommerce
  const sendOrderToWooCommerce = async (orderData) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : '', // ✅ أضف Token
        },
        body: JSON.stringify({ 
          orderData: {
            ...orderData,
            customer_id: user?.id || 0, // ✅ أضف customer_id
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

  if (cart.length === 0) {
    return (
      <Layout title="الدفع | تاب لينك السعودية">
        <div className="container-custom section-padding">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold mb-4">السلة فارغة</h1>
            <p className="text-gray-600 mb-8">أضف منتجات للسلة أولاً لإتمام الطلب</p>
            <Link href="/shop" className="btn-primary">
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const onApprove = async (data, actions) => {
    setLoading(true);
    
    try {
      const details = await actions.order.capture();
      console.log('PayPal Payment successful:', details);
      
      const orderData = {
        name: formData.name || `${details.payer.name.given_name} ${details.payer.name.surname}`,
        email: formData.email || details.payer.email_address,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        notes: formData.notes,
        paymentMethod: 'paypal',
        paid: true,
        paypalOrderId: details.id,
        items: cart,
        customer_id: user?.id || 0, // ✅ أضف هذا
      };

      const result = await sendOrderToWooCommerce(orderData);
      
      clearCart();
      
      if (result) {
        router.push(`/thank-you?payment=paypal&order_id=${result.orderId}&order_number=${result.orderNumber}&name=${encodeURIComponent(orderData.name)}&phone=${orderData.phone}&email=${encodeURIComponent(orderData.email)}&city=${encodeURIComponent(orderData.city)}&address=${encodeURIComponent(orderData.address)}&notes=${encodeURIComponent(orderData.notes || '')}&paypal_id=${details.id}`);
      } else {
        router.push('/thank-you?payment=paypal&order_id=' + details.id);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal Error:', err);
    alert('حدث خطأ في الدفع عبر PayPal. يرجى المحاولة مرة أخرى.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'paypal') {
      alert('يرجى استخدام زر PayPal أدناه لإتمام الدفع');
      return;
    }
    
    setLoading(true);

    if (!formData.name || !formData.phone || !formData.email || !formData.city || !formData.address) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        notes: formData.notes,
        paymentMethod: paymentMethod,
        paid: false,
        items: cart,
        customer_id: user?.id || 0, // ✅ أضف هذا
      };

      const result = await sendOrderToWooCommerce(orderData);

      clearCart();
      
      if (result) {
        router.push(`/thank-you?order_id=${result.orderId}&order_number=${result.orderNumber}&name=${encodeURIComponent(formData.name)}&phone=${formData.phone}&email=${encodeURIComponent(formData.email)}&city=${encodeURIComponent(formData.city)}&address=${encodeURIComponent(formData.address)}&notes=${encodeURIComponent(formData.notes || '')}&payment=${paymentMethod}`);
      } else {
        router.push('/thank-you');
      }
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء الطلب');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="إتمام الطلب | تاب لينك السعودية">
      <div className="container-custom section-padding">
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

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            إتمام الطلب
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        {/* ✅ رسالة للمستخدم المسجل */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
          >
            <p className="text-green-800">
              ✅ مرحباً <strong>{user.name}</strong>! بياناتك محفوظة وسيتم ربط الطلب بحسابك تلقائياً.
            </p>
          </motion.div>
        )}

        {/* ✅ رسالة للزوار */}
        {!user && (
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* باقي الكود كما هو... */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">بيانات التوصيل</h2>

              <div className="space-y-4 mb-8">
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
                      disabled={!!user} // ✅ تعطيل التعديل إذا كان مسجل
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all ${
                        user ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">المدينة *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  >
                    <option value="">اختر المدينة</option>
                    <option value="بريدة">بريدة</option>
                    <option value="عنيزة">عنيزة</option>
                    <option value="الرس">الرس</option>
                    <option value="المذنب">المذنب</option>
                    <option value="البكيرية">البكيرية</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">العنوان التفصيلي *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                    placeholder="الحي، الشارع، رقم المبنى..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ملاحظات إضافية (اختياري)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                    placeholder="أي ملاحظات أو تعليمات خاصة بالتوصيل..."
                  ></textarea>
                </div>
              </div>

              {/* باقي الكود (طريقة الدفع والأزرار) كما هو... */}
              <h2 className="text-2xl font-bold mb-6">طريقة الدفع</h2>
              
              <div className="space-y-4 mb-8">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-gray-300 hover:border-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-gold"
                  />
                  <div>
                    <div className="font-bold">الدفع عند الاستلام</div>
                    <div className="text-sm text-gray-600">ادفع نقداً عند استلام الطلب</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'paypal' ? 'border-gold bg-gold/5' : 'border-gray-300 hover:border-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-gold"
                  />
                  <div>
                    <div className="font-bold">PayPal</div>
                    <div className="text-sm text-gray-600">ادفع بأمان عبر PayPal</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'bank' ? 'border-gold bg-gold/5' : 'border-gray-300 hover:border-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-gold"
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
                  disabled={loading}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري المعالجة...' : '✅ إكمال الطلب'}
                </button>
              )}
            </motion.form>
          </div>

          {/* ملخص الطلب - باقي الكود كما هو */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b">
                    <div className="relative w-16 h-16 flex-shrink-0">
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

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{total.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الضريبة (15%)</span>
                  <span className="font-bold">{tax.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="font-bold text-green-600">مجاني</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-gold">{finalTotal.toFixed(2)} ر.س</span>
                </div>
                {paymentMethod === 'paypal' && (
                  <div className="text-sm text-gray-500 text-center">
                    ≈ ${finalTotalUSD} USD
                  </div>
                )}
              </div>

              <div className="bg-gold/10 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  {paymentMethod === 'paypal' 
                    ? 'بعد الدفع عبر PayPal سيتم إرسال تفاصيل الطلب عبر واتساب'
                    : 'سيتم إرسال الطلب عبر واتساب وسنتواصل معك لتأكيد الطلب وإتمام الدفع'
                  }
                </p>
              </div>

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
