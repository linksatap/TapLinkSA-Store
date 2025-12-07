import { motion } from 'framer-motion';
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
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b">
            {/* صورة المنتج */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              <Image
                src={item.images?.[0]?.src || '/placeholder-product.jpg'}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* معلومات المنتج */}
            <div className="text-gray-600 flex-grow">
              <div className="font-medium line-clamp-1 text-sm">{item.name}</div>
              <div className="text-sm">الكمية: {item.quantity}</div>
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
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>الخصم ({appliedCoupon.code})</span>
            <span className="font-bold">-{discount.toFixed(2)} ر.س</span>
          </div>
        )}

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

        {/* المجموع الكلي */}
        <div className="border-t pt-3 flex justify-between text-xl font-bold">
          <span>المجموع الكلي</span>
          <span className="text-gold">{finalTotal.toFixed(2)} ر.س</span>
        </div>

        {/* رسالة التوفير */}
        {appliedCoupon && discount > 0 && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-700 font-bold text-center">
              🎉 وفرت {discount.toFixed(2)} ر.س!
            </p>
          </div>
        )}

        {/* سعر PayPal */}
        {paymentMethod === 'paypal' && (
          <div className="text-sm text-gray-500 text-center">
            ≈ ${finalTotalUSD} USD
          </div>
        )}
      </div>

      {/* ملاحظة تحت الملخص */}
      <div className="bg-gold/10 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          {paymentMethod === 'paypal'
            ? 'بعد الدفع عبر PayPal سيتم إرسال تفاصيل الطلب عبر واتساب'
            : 'وسائل الدفع الأخرى ما زالت تحت التطوير والدمج'}
        </p>
      </div>

      {/* عناصر الثقة والأمان */}
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
  );
}