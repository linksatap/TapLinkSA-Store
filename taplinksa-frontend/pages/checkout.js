import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import CouponInput from '../components/CouponInput';

// المكونات المحسّنة
import FormField from '../components/checkout/FormField';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import OrderSummary from '../components/checkout/OrderSummary';

// Custom Hooks
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { useShippingCalculator } from '../hooks/useShippingCalculator';

/**
 * صفحة الدفع المحسّنة
 * 
 * التحسينات:
 * - أداء محسّن مع useMemo و useCallback
 * - تحقق مباشر من الحقول (inline validation)
 * - دعم كامل لإمكانية الوصول (accessibility)
 * - تصميم محسّن للموبايل
 * - معالجة أخطاء أفضل
 * - بنية كود أنظف وأسهل للصيانة
 */
export default function CheckoutImproved() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useUser();
  
  // حالات الصفحة
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [apiError, setApiError] = useState(null);

  // استخدام custom hook لإدارة النموذج
  const {
    formData,
    errors,
    touched,
    isValid,
    isComplete,
    handleChange,
    handleBlur,
    validateAllFields,
    updateFormData,
  } = useCheckoutForm();

  // حساب المجموع الفرعي مع memoization
  const subtotal = useMemo(() => getCartTotal(), [cart]);

  // استخدام custom hook لحساب الشحن
  const {
    shippingInfo,
    shippingCost,
    calculating: calculatingShipping,
    error: shippingError,
    retry: retryShipping,
  } = useShippingCalculator(formData.postcode, cart, subtotal);

  // حساب الخصم
  const discount = useMemo(() => 
    appliedCoupon ? appliedCoupon.discountAmount : 0,
    [appliedCoupon]
  );

  // حساب المجموع النهائي
  const finalTotal = useMemo(() => 
    subtotal - discount + shippingCost,
    [subtotal, discount, shippingCost]
  );

  // تحويل إلى دولار لـ PayPal
  const finalTotalUSD = useMemo(() => 
    (finalTotal * 0.2667).toFixed(2),
    [finalTotal]
  );

  /**
   * تحديث بيانات النموذج عند تسجيل دخول المستخدم
   */
  useEffect(() => {
    if (user) {
      updateFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, updateFormData]);

  /**
   * معالج تطبيق الكوبون
   */
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  /**
   * إرسال الطلب إلى WooCommerce
   */
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
            coupon_lines: appliedCoupon ? [
              {
                code: appliedCoupon.code,
              }
            ] : [],
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Order created in WooCommerce:', result.orderId);
        return result;
      } else {
        throw new Error(result.message || 'فشل إنشاء الطلب');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  /**
   * إنشاء طلب PayPal
   */
  const createPayPalOrder = (data, actions) => {
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

  /**
   * معالج نجاح الدفع عبر PayPal
   */
  const onPayPalApprove = async (data, actions) => {
    setLoading(true);
    setApiError(null);
    
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
        router.push('/thank-you?payment=paypal&order_id=' + details.id);
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      setApiError('حدث خطأ أثناء معالجة الدفع. يرجى التواصل مع الدعم الفني.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * معالج خطأ PayPal
   */
  const onPayPalError = (err) => {
    console.error('PayPal Error:', err);
    setApiError('حدث خطأ في الدفع عبر PayPal. يرجى المحاولة مرة أخرى.');
  };

  /**
   * معالج إرسال النموذج
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // منع الإرسال إذا كانت طريقة الدفع PayPal
    if (paymentMethod === 'paypal') {
      setApiError('يرجى استخدام زر PayPal أدناه لإتمام الدفع');
      return;
    }
    
    // التحقق من جميع الحقول
    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      setApiError('يرجى تصحيح الأخطاء في النموذج أعلاه');
      // التمرير إلى أول خطأ
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    // التحقق من الرمز البريدي
    if (!formData.postcode) {
      setApiError('يرجى إدخال الرمز البريدي لحساب تكلفة الشحن');
      document.getElementById('postcode')?.focus();
      return;
    }

    setLoading(true);
    setApiError(null);

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
        paymentMethod: paymentMethod,
        paid: false,
        items: cart,
        customer_id: user?.id || 0,
        coupon_code: appliedCoupon?.code || '',
      };

      const result = await sendOrderToWooCommerce(orderData);

      clearCart();
      
      if (result) {
        router.push(`/thank-you?order_id=${result.orderId}&order_number=${result.orderNumber}`);
      } else {
        router.push('/thank-you');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setApiError('حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * عرض صفحة السلة الفارغة
   */
  if (cart.length === 0) {
    return (
      <Layout title="الدفع | تاب لينك السعودية">
        <div className="container-custom section-padding">
          <div className="text-center py-12 md:py-20">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6" aria-hidden="true">🛒</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
              السلة فارغة
            </h1>
            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
              أضف منتجات للسلة أولاً لإتمام الطلب
            </p>
            <Link 
              href="/shop" 
              className="btn-primary inline-block"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // التحقق من إمكانية الإرسال
  const canSubmit = isValid && isComplete && formData.postcode && !loading;

  return (
    <Layout title="إتمام الطلب | تاب لينك السعودية">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <nav className="mb-6 md:mb-8 text-xs md:text-sm" aria-label="مسار التنقل">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href="/" className="text-gray-600 hover:text-gold transition-colors">
                الرئيسية
              </Link>
            </li>
            <li className="text-gray-400" aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="text-gray-600 hover:text-gold transition-colors">
                المتجر
              </Link>
            </li>
            <li className="text-gray-400" aria-hidden="true">/</li>
            <li>
              <Link href="/cart" className="text-gray-600 hover:text-gold transition-colors">
                السلة
              </Link>
            </li>
            <li className="text-gray-400" aria-hidden="true">/</li>
            <li className="text-gold font-bold" aria-current="page">
              الدفع
            </li>
          </ol>
        </nav>

        {/* العنوان */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900">
            إتمام الطلب
          </h1>
          <div className="w-20 md:w-24 h-1 bg-gold mx-auto"></div>
        </div>

        {/* رسالة للمستخدم المسجل */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border-2 border-green-200 rounded-xl"
            role="status"
          >
            <p className="text-sm md:text-base text-green-800">
              ✅ مرحباً <strong>{user.name}</strong>! بياناتك محفوظة وسيتم ربط الطلب بحسابك تلقائياً.
            </p>
          </motion.div>
        )}

        {/* رسالة للضيوف */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <p className="text-sm md:text-base text-blue-800">
              💡 لديك حساب؟{' '}
              <Link 
                href={`/login?redirect=/checkout`} 
                className="text-blue-600 font-bold underline hover:text-blue-700"
              >
                سجل دخولك
              </Link>{' '}
              لحفظ الطلب في حسابك وتتبعه لاحقاً.
            </p>
          </motion.div>
        )}

        {/* رسالة خطأ عامة */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border-2 border-red-200 rounded-xl"
            role="alert"
          >
            <p className="text-sm md:text-base text-red-800 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{apiError}</span>
            </p>
          </motion.div>
        )}

        {/* المحتوى الرئيسي */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* النموذج */}
          <div className="lg:col-span-2 space-y-6">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8"
              noValidate
            >
              {/* معلومات الاتصال */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">
                  معلومات الاتصال
                </h2>
                
                <div className="grid gap-4 md:gap-5">
                  <FormField
                    id="name"
                    name="name"
                    label="الاسم الكامل"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    touched={touched.name}
                    required
                    autoComplete="name"
                    placeholder="مثال: أحمد محمد"
                  />

                  <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                    <FormField
                      id="email"
                      name="email"
                      label="البريد الإلكتروني"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email}
                      touched={touched.email}
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder="example@domain.com"
                    />

                    <FormField
                      id="phone"
                      name="phone"
                      label="رقم الهاتف"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.phone}
                      touched={touched.phone}
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      pattern="[0-9]*"
                      placeholder="05xxxxxxxx"
                      maxLength="10"
                    />
                  </div>
                </div>
              </section>

              {/* عنوان الشحن */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">
                  عنوان الشحن
                </h2>
                
                <div className="grid gap-4 md:gap-5">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                    <FormField
                      id="state"
                      name="state"
                      label="المنطقة"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.state}
                      touched={touched.state}
                      required
                      autoComplete="address-level1"
                      placeholder="مثال: الرياض"
                    />

                    <FormField
                      id="city"
                      name="city"
                      label="المدينة"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.city}
                      touched={touched.city}
                      required
                      autoComplete="address-level2"
                      placeholder="مثال: الرياض"
                    />
                  </div>

                  <FormField
                    id="postcode"
                    name="postcode"
                    label="الرمز البريدي"
                    type="text"
                    value={formData.postcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.postcode}
                    touched={touched.postcode}
                    required
                    autoComplete="postal-code"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength="5"
                    placeholder="12345"
                  />

                  <FormField
                    id="address"
                    name="address"
                    label="العنوان الكامل"
                    type="textarea"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address}
                    touched={touched.address}
                    required
                    autoComplete="street-address"
                    placeholder="الحي، الشارع، رقم المبنى..."
                    rows="3"
                  />

                  <FormField
                    id="notes"
                    name="notes"
                    label="ملاحظات إضافية (اختياري)"
                    type="textarea"
                    value={formData.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="أي ملاحظات أو تعليمات خاصة بالتوصيل..."
                    rows="3"
                  />
                </div>
              </section>

              {/* طريقة الدفع */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">
                  طريقة الدفع
                </h2>
                
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
              </section>

              {/* ملاحظة PayPal */}
              {paymentMethod === 'paypal' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-xs md:text-sm text-blue-800 mb-2">
                    💡 <strong>ملاحظة:</strong> PayPal سيحوّل المبلغ تلقائياً من الريال السعودي إلى الدولار الأمريكي
                  </p>
                  <p className="text-xs md:text-sm text-blue-600">
                    المبلغ: <strong>{finalTotal.toFixed(2)} ر.س</strong> ≈ <strong>${finalTotalUSD} USD</strong>
                  </p>
                </motion.div>
              )}

              {/* تحذير إذا لم يتم إدخال الرمز البريدي */}
              {!formData.postcode && (
                <div className="p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs md:text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>⚠️ يرجى إدخال الرمز البريدي لحساب تكلفة الشحن وإكمال الطلب</span>
                  </p>
                </div>
              )}

              {/* زر الإرسال أو PayPal */}
              {paymentMethod === 'paypal' ? (
                <div className="pt-4">
                  <PayPalButtons
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={onPayPalError}
                    disabled={!canSubmit}
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'pay',
                      height: 48,
                    }}
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary w-full text-base md:text-lg py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-busy={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جاري المعالجة...
                    </span>
                  ) : (
                    '✅ إكمال الطلب'
                  )}
                </button>
              )}
            </motion.form>

            {/* الكوبون */}
            <CouponInput 
              onApplyCoupon={handleApplyCoupon} 
              subtotal={subtotal}
            />
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              appliedCoupon={appliedCoupon}
              shippingInfo={shippingInfo}
              calculatingShipping={calculatingShipping}
              shippingError={shippingError}
              onRetryShipping={retryShipping}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
