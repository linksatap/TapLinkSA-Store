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
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل التحقق من الكوبون');
      }

      // التحقق من الحد الأدنى
      if (data.coupon.minimum_amount && subtotal < data.coupon.minimum_amount) {
        throw new Error(`الحد الأدنى للطلب ${data.coupon.minimum_amount} ر.س`);
      }

      // حساب الخصم
      let discountAmount = 0;
      if (data.coupon.discount_type === 'percent') {
        discountAmount = (subtotal * parseFloat(data.coupon.amount)) / 100;
        
        // التحقق من الحد الأقصى للخصم
        if (data.coupon.maximum_amount && discountAmount > parseFloat(data.coupon.maximum_amount)) {
          discountAmount = parseFloat(data.coupon.maximum_amount);
        }
      } else {
        discountAmount = parseFloat(data.coupon.amount);
      }

      const couponData = {
        ...data.coupon,
        discountAmount: discountAmount,
      };

      setAppliedCoupon(couponData);
      setSuccess(`تم تطبيق كود الخصم! وفرت ${discountAmount.toFixed(2)} ر.س`);
      onApplyCoupon(couponData);
      setCouponCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setSuccess('');
    setError('');
    onApplyCoupon(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-dark mb-4">🎟️ كود الخصم</h3>

      {!appliedCoupon ? (
        <div className="flex gap-3">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="أدخل كود الخصم"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading}
            className="px-6 py-3 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳' : 'تطبيق'}
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-green-800 mb-1">
                ✓ {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                خصم {appliedCoupon.discount_type === 'percent' 
                  ? `${appliedCoupon.amount}%` 
                  : `${appliedCoupon.amount} ر.س`}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕ إزالة
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg"
          >
            <p className="text-sm text-red-600">❌ {error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-green-50 border-2 border-green-300 rounded-lg"
          >
            <p className="text-sm text-green-600">✓ {success}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
