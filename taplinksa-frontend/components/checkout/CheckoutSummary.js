import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function CheckoutSummary({
  cart,
  subtotal,
  discount,
  shippingInfo,
  finalTotal,
  finalTotalUSD,
  appliedCoupon,
  paymentMethod,
  codFee = 0, // ✅ إضافة رسوم COD
}) {
  const shippingCost = shippingInfo ? shippingInfo.cost : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24"
    >
      <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

      {/* قائمة المنتجات */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
            {/* صورة المنتج */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={item.images?.[0]?.src || '/placeholder-product.jpg'}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* معلومات المنتج */}
            <div className="text-gray-600 flex-grow min-w-0">
              <div className="font-medium line-clamp-2 text-sm mb-1">{item.name}</div>
              <div className="text-xs text-gray-500">الكمية: {item.quantity}</div>
            </div>

            {/* السعر */}
            <div className="font-bold text-gold whitespace-nowrap text-sm">
              {(parseFloat(item.price) * item.quantity).toFixed(2)} ر.س
            </div>
          </div>
        ))}
      </div>

      {/* تفاصيل الأسعار */}
      <div className="space-y-3 mb-6">

        {/* المجموع الفرعي */}
        <div className="flex justify-between text-gray-600">
          <span>المجموع الفرعي</span>
          <span className="font-bold">{subtotal.toFixed(2)} ر.س</span>
        </div>

        {/* الخصم (إن وجد) */}
        <AnimatePresence>
          {appliedCoupon && discount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between text-green-600"
            >
              <div className="flex items-center gap-2">
                <span>الخصم</span>
                <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  {appliedCoupon.code}
                </span>
              </div>
              <span className="font-bold">-{discount.toFixed(2)} ر.س</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تكلفة الشحن */}
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

        {/* ✅ رسوم الدفع عند الاستلام */}
        <AnimatePresence>
          {codFee > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-700">رسوم الدفع عند الاستلام</span>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 text-xs"
                  title="رسوم إضافية لتغطية تكاليف خدمة الدفع النقدي"
                >
                  ❓
                </button>
              </div>
              <span className="font-bold text-yellow-700">
                {codFee.toFixed(2)} ر.س
              </span>
            </motion.div>
          )}
        </AnimatePresence>



        {/* المجموع الكلي */}
        <div className="border-t-2 pt-4 flex justify-between text-xl font-bold">
          <span>المجموع الكلي</span>
          <div className="text-left">
            <div className="text-gold">{finalTotal.toFixed(2)} ر.س</div>
            {/* ✅ رسالة توفير رسوم COD */}
            {codFee > 0 && (
              <div className="text-xs text-gray-500 font-normal mt-1">
                وفّر {codFee.toFixed(2)} ر.س بالدفع الإلكتروني
              </div>
            )}
          </div>
        </div>

        {/* رسالة التوفير من الكوبون */}
        <AnimatePresence>
          {appliedCoupon && discount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-green-50 border border-green-200 p-3 rounded-lg"
            >
              <p className="text-sm text-green-700 font-bold text-center flex items-center justify-center gap-2">
                <span>🎉</span>
                <span>وفرت {discount.toFixed(2)} ر.س!</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ تحذير رسوم COD */}
        <AnimatePresence>
          {codFee > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg"
            >
              <p className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-yellow-600">💡</span>
                <span>
                  <strong>نصيحة:</strong> وفّر {codFee.toFixed(2)} ر.س عن طريق الدفع الإلكتروني 
                  (PayPal أو تحويل بنكي)
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* سعر PayPal */}
        {paymentMethod === 'paypal' && finalTotalUSD && (
          <div className="text-sm text-gray-500 text-center bg-gray-50 py-2 rounded">
            ≈ ${finalTotalUSD} USD
          </div>
        )}
      </div>

      {/* ملاحظة تحت الملخص */}
      <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {paymentMethod === 'cod' ? '📦' : paymentMethod === 'paypal' ? '💳' : '🏦'}
          </span>
          <p className="text-sm text-gray-700">
            {paymentMethod === 'cod' && (
              <>ادفع نقداً أو ببطاقة مدى عند استلام الطلب. رسوم إضافية: {codFee.toFixed(2)} ر.س</>
            )}
            {paymentMethod === 'paypal' && (
              <>بعد  عبر PayPal سيتم إرسال تفاصيل الطلب عبر واتساب</>
            )}
            {paymentMethod === 'bank' && (
              <>سيتم شحن الطلب بعد تأكيد التحويل البنكي (عادةً خلال 24 ساعة)</>
            )}
           
          </p>
        </div>
      </div>

      {/* عناصر الثقة والأمان */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-start gap-3">
          <span className="text-green-500 text-lg">🔒</span>
          <span>دفع آمن ومضمون 100%</span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-green-500 text-lg">↩️</span>
          <span>إمكانية الإرجاع خلال 14 يوم</span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-green-500 text-lg">💬</span>
          <span>دعم فني متاح 24/7</span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-green-500 text-lg">🚚</span>
          <span>
            {shippingCost === 0 
              ? 'شحن مجاني لطلبك' 
              : 'شحن سريع لجميع مدن المملكة'}
          </span>
        </div>
      </div>

      {/* شارة الثقة */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            <span>متجر معتمد</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="text-gold">⭐</span>
            <span>تقييم 4.8/5</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span>🛡️</span>
            <span>حماية المشتري</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
