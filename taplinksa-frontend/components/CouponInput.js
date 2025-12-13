import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CouponInput({ onApplyCoupon, subtotal }) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('الرجاء إدخال كود الخصم');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: couponCode,
          subtotal: subtotal // ✅ إرسال المجموع الفرعي
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل التحقق من الكوبون');
      }

      // ✅ استخدام البيانات من API مباشرة
      const couponData = {
        code: data.coupon.code,
        type: data.coupon.type || data.coupon.discount_type,
        amount: data.coupon.amount,
        discountAmount: data.coupon.discountAmount, // ✅ من API
        description: data.coupon.description || '',
        free_shipping: data.coupon.free_shipping || false,
      };

      setAppliedCoupon(couponData);
      setSuccess(`تم تطبيق كود الخصم! وفرت ${couponData.discountAmount.toFixed(2)} ر.س 🎉`);
      onApplyCoupon(couponData); // ✅ تمرير البيانات للـ Parent
      setCouponCode('');
      
      console.log('✅ Coupon applied:', couponData);
    } catch (err) {
      setError(err.message);
      console.error('❌ Coupon error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setSuccess('');
    setError('');
    onApplyCoupon(null); // ✅ إزالة الكوبون
    console.log('🗑️ Coupon removed');
  };

  // ✅ دعم Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleApplyCoupon();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
        <span className="text-2xl">🎟️</span>
        <span>كود الخصم</span>
      </h3>

      {!appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress} // ✅ دعم Enter
              placeholder="أدخل كود الخصم"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
              maxLength={20}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="px-6 py-3 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>جاري التحقق...</span>
                </span>
              ) : (
                '✓ تطبيق'
              )}
            </button>
          </div>

          {/* ✅ أمثلة على الكوبونات */}
          <div className="text-xs text-gray-500 flex items-start gap-1">
            <span>💡</span>
            <span>جرّب: <strong className="text-gold">جديد</strong> للحصول على خصم 20%</span>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-bold text-green-800 mb-1 flex items-center gap-2">
                <span className="text-xl">✓</span>
                <span>{appliedCoupon.code}</span>
              </p>
              <p className="text-sm text-green-700">
                {appliedCoupon.type === 'percent' 
                  ? `خصم ${appliedCoupon.amount}%` 
                  : `خصم ${appliedCoupon.amount} ر.س`}
              </p>
              {appliedCoupon.description && (
                <p className="text-xs text-green-600 mt-1">
                  {appliedCoupon.description}
                </p>
              )}
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 font-bold text-lg px-3 py-1 hover:bg-red-50 rounded-lg transition-all"
              title="إزالة الكوبون"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* ✅ رسائل الخطأ والنجاح */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-sm text-red-600 flex items-start gap-2">
                <span className="text-base">❌</span>
                <span>{error}</span>
              </p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
              <p className="text-sm text-green-700 font-medium flex items-start gap-2">
                <span className="text-base">✓</span>
                <span>{success}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ ملاحظة إضافية */}
      {!appliedCoupon && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-2">
            <p className="flex items-start gap-2">
              <span>📌</span>
              <span>يمكن استخدام كود خصم واحد فقط لكل طلب</span>
            </p>
            <p className="flex items-start gap-2">
              <span>🎁</span>
              <span>الكوبونات غير قابلة للاستبدال نقداً</span>
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
