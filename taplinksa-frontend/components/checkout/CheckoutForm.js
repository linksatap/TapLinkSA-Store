import { motion } from 'framer-motion';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';

export default function CheckoutForm({
  formData,
  handleChange,
  handleSubmit,
  loading,
  paymentMethod,
  setPaymentMethod,
  shippingInfo,
  finalTotal,
  finalTotalUSD,
  user,
}) {
  const router = useRouter();

  // إنشاء طلب PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: finalTotalUSD,
            currency_code: 'USD',
          },
          description: `TapLink Order - ${formData.items?.length || 0} items`,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });
  };

  // عند الموافقة على الدفع PayPal
  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      // معالجة الطلب بعد موافقة PayPal
      router.push(`/thank-you?payment=paypal&order_id=${details.id}`);
    } catch (error) {
      console.error('PayPal Error:', error);
      alert('حدث خطأ أثناء معالجة الطلب');
    }
  };

  // عند حدوث خطأ PayPal
  const onError = (err) => {
    console.error('PayPal Error:', err);
    alert('حدث خطأ في الدفع عبر PayPal. يرجى المحاولة مرة أخرى.');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
    >
      {/* قسم بيانات التوصيل */}
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
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

        {/* تحذير إذا لم يتم إدخال الرمز البريدي */}
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
            placeholder="أي ملاحظات تخص التوصيل..."
          ></textarea>
        </div>
      </div>

      {/* قسم طرق الدفع */}
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

      {/* زر الدفع */}
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
  );
}