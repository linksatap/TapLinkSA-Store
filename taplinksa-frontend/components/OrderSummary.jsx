import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CartItem from './CartItem';
import ShippingInfo from './ShippingInfo';

/**
 * مكون ملخص الطلب مع حسابات محسّنة
 */
export default function OrderSummary({
  cart,
  subtotal,
  appliedCoupon,
  shippingInfo,
  calculatingShipping,
  shippingError,
  onRetryShipping,
  paymentMethod,
}) {
  // حساب الخصم
  const discount = useMemo(() => 
    appliedCoupon ? appliedCoupon.discountAmount : 0,
    [appliedCoupon]
  );

  // حساب تكلفة الشحن
  const shippingCost = useMemo(() => 
    shippingInfo ? shippingInfo.cost : 0,
    [shippingInfo]
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:sticky lg:top-24"
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">
        ملخص الطلب
      </h2>

      {/* عناصر السلة */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* تفاصيل الأسعار */}
      <div className="space-y-3 mb-6">
        {/* المجموع الفرعي */}
        <div className="flex justify-between text-gray-600">
          <span>المجموع الفرعي</span>
          <span className="font-bold text-gray-900">{subtotal.toFixed(2)} ر.س</span>
        </div>
        
        {/* الخصم */}
        {appliedCoupon && discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              الخصم ({appliedCoupon.code})
            </span>
            <span className="font-bold">-{discount.toFixed(2)} ر.س</span>
          </div>
        )}
        
        {/* الشحن */}
        <ShippingInfo
          shippingInfo={shippingInfo}
          calculating={calculatingShipping}
          error={shippingError}
          onRetry={onRetryShipping}
        />
        
        {/* المجموع الكلي */}
        <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-lg md:text-xl font-bold">
          <span className="text-gray-900">المجموع الكلي</span>
          <span className="text-gold">{finalTotal.toFixed(2)} ر.س</span>
        </div>
        
        {/* رسالة التوفير */}
        {appliedCoupon && discount > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 border border-green-200 p-3 rounded-lg"
          >
            <p className="text-sm text-green-700 font-bold text-center">
              🎉 وفرت {discount.toFixed(2)} ر.س!
            </p>
          </motion.div>
        )}
        
        {/* معلومات PayPal */}
        {paymentMethod === 'paypal' && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">
              💡 سيتم التحويل تلقائياً إلى الدولار
            </p>
            <p className="text-sm text-blue-900 font-medium text-center">
              ≈ ${finalTotalUSD} USD
            </p>
          </div>
        )}
      </div>

      {/* ملاحظة الدفع */}
      <div className="bg-gold/10 border border-gold/20 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
          {paymentMethod === 'paypal' 
            ? '✓ بعد الدفع عبر PayPal سيتم إرسال تفاصيل الطلب عبر واتساب'
            : '⚠️ وسائل الدفع الأخرى ما زالت تحت التطوير والدمج'
          }
        </p>
      </div>

      {/* ميزات الأمان */}
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>دفع آمن ومضمون</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>إمكانية الإرجاع خلال 14 يوم</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>دعم فني متاح 24/7</span>
        </div>
      </div>
    </motion.div>
  );
}
