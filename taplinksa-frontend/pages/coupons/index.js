import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import {
  FiCopy,
  FiExternalLink,
  FiTag,
  FiClock,
  FiCheck,
  FiShare2,
  FiEye
} from 'react-icons/fi';
import { FaWhatsapp, FaTwitter, FaFacebook, FaTelegram, FaLink } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';

export default function CouponsPage({ initialCoupons }) {
  const [coupons] = useState(initialCoupons);
  const [copiedId, setCopiedId] = useState(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(null);
  const [revealedCouponId, setRevealedCouponId] = useState(null);

  // ✅ تنسيق التاريخ بدون مشاكل Hydration
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // نسخ الكوبون + تتبع النسخ
  const handleCopyCoupon = async (coupon) => {
    try {
      await navigator.clipboard.writeText(coupon.coupon_code);
      setCopiedId(coupon.id);
      setTimeout(() => setCopiedId(null), 2000);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_WP_API_URL}/taplink/v1/coupon-track`,
          {
            coupon_id: coupon.id,
            action_type: 'copy',
          },
          { timeout: 3000 }
        );
      } catch (trackError) {
        console.warn('⚠️ Tracking error (ignored):', trackError.message);
      }
    } catch (error) {
      console.error('Error copying coupon:', error);
      alert('حدث خطأ في النسخ');
    }
  };

  // استخدام الكوبون (نسخ + تتبع + فتح الرابط)
  const handleUseCoupon = async (coupon) => {
    try {
      // لو لم يكن مكشوفاً، اكشفه أولاً
      if (revealedCouponId !== coupon.id) {
        setRevealedCouponId(coupon.id);
      }

      await navigator.clipboard.writeText(coupon.coupon_code);
      setCopiedId(coupon.id);
      setTimeout(() => setCopiedId(null), 2000);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_WP_API_URL}/taplink/v1/coupon-track`,
          {
            coupon_id: coupon.id,
            action_type: 'redirect',
          },
          { timeout: 3000 }
        );
      } catch (trackError) {
        console.warn('⚠️ Tracking error (ignored):', trackError.message);
      }

      setTimeout(() => {
        window.open(coupon.affiliate_url, '_blank', 'noopener,noreferrer');
      }, 500);
    } catch (error) {
      console.error('Error using coupon:', error);
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const days = Math.ceil(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  // مشاركة الكوبون
  const handleShare = (coupon, platform) => {
    const url =
      typeof window !== 'undefined'
        ? window.location.origin + '/coupons'
        : '';
    const text = `🎁 ${coupon.title}\n\nكود الخصم: ${coupon.coupon_code}\n${
      coupon.discount_value ? `خصم ${coupon.discount_value}` : ''
    }\n\nاحصل على الكوبون من:`;

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        text + ' ' + url
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('✅ تم نسخ الرابط!');
      setShareMenuOpen(null);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShareMenuOpen(null);
    }
  };

  return (
    <Layout
      title="عروض وكوبونات حصرية - تاب لينك"
      description="احصل على أفضل الخصومات والكوبونات من شركائنا"
    >
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            🎁 عروض وكوبونات حصرية
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '96px' }}
            transition={{ delay: 0.2 }}
            className="h-1 bg-gold mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            احصل على أفضل الخصومات من شركائنا. اضغط لكشف الكوبون واستمتع بالتوفير!
          </motion.p>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🎫</div>
            <h2 className="text-2xl font-bold mb-2">لا توجد كوبونات حالياً</h2>
            <p className="text-gray-600">تابعنا لتحصل على أحدث العروض</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon, index) => {
              const expired = isExpired(coupon.expiry_date);
              const daysLeft = getDaysRemaining(coupon.expiry_date);
              const isRevealed = revealedCouponId === coupon.id;

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all ${
                    expired ? 'opacity-60' : ''
                  }`}
                >
                  {/* صورة الشركة */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                    {coupon.image ? (
                      <div className="relative w-full h-full p-6">
                        <Image
                          src={coupon.image}
                          alt={coupon.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-6xl">🎁</div>
                      </div>
                    )}

                    {/* Badge الخصم */}
                    {coupon.discount_value && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                        {coupon.discount_value}
                      </div>
                    )}

                    {/* Badge منتهي */}
                    {expired && (
                      <div className="absolute top-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                        منتهي
                      </div>
                    )}
                  </div>

                  {/* محتوى الكوبون */}
                  <div className="p-6">
                    {/* اسم الشركة */}
                    {coupon.company_name && (
                      <div className="flex items-center gap-2 mb-2">
                        <FiTag className="text-gold" />
                        <span className="text-sm font-medium text-gray-600">
                          {coupon.company_name}
                        </span>
                      </div>
                    )}

                    {/* عنوان الكوبون */}
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                      {coupon.title}
                    </h3>

                    {/* الوصف */}
                    {coupon.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {coupon.description}
                      </p>
                    )}

                    {/* 🎯 منطقة الكوبون (تجربة كشف جذابة) */}
                    <div className="bg-gradient-to-r from-gold/20 to-yellow-100 border-2 border-dashed border-gold rounded-xl p-4 mb-4 relative overflow-hidden">
                      {/* طبقة الخلفية المتحركة لمحاكاة القشط */}
                      {!isRevealed && !expired && (
                        <motion.div
                          initial={{ x: '0%' }}
                          animate={{ x: ['0%', '50%', '0%'] }}
                          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          style={{ mixBlendMode: 'soft-light' }}
                        />
                      )}

                      {isRevealed ? (
                        // الكوبون مكشوف
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex-1">
                            <span className="text-xs text-gray-600 block mb-1">
                              الكود
                            </span>
                            <span className="font-mono font-bold text-lg text-gray-800 select-all">
                              {coupon.coupon_code}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyCoupon(coupon)}
                            disabled={expired}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                              expired
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : copiedId === coupon.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gold hover:bg-yellow-500 text-dark'
                            }`}
                          >
                            {copiedId === coupon.id ? (
                              <>
                                <FiCheck />
                                <span>تم</span>
                              </>
                            ) : (
                              <>
                                <FiCopy />
                                <span>نسخ</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        // الكوبون مخفي حتى الضغط (محاكاة القشط)
                        <button
                          onClick={async () => {
  if (!expired) {
    setRevealedCouponId(coupon.id);

    // تسجيل كشف الكوبون
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_WP_API_URL}/taplink/v1/coupon-track`,
        {
          coupon_id: coupon.id,
          action_type: 'reveal', // نوع جديد
        },
        { timeout: 3000 }
      );
    } catch (e) {
      console.warn('Tracking reveal error (ignored):', e.message);
    }

    // اختياري: نسخ تلقائي بعد الكشف
    await handleCopyCoupon(coupon);
  }
}}

                          disabled={expired}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg relative z-10 transition-all ${
                            expired
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 hover:from-gray-300 hover:to-gray-300 text-gray-800 shadow-inner'
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              <FiEye />
                              اضغط لكشف الكوبون
                            </span>
                            <span className="font-mono tracking-[0.3em] text-base">
                              ••••••••
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-700">
                            كشف الكود
                          </span>
                        </button>
                      )}
                    </div>

                    {/* زر الذهاب للموقع */}
                    <button
                      onClick={() => handleUseCoupon(coupon)}
                      disabled={expired}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mb-3 ${
                        expired
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <FiExternalLink />
                      <span>{expired ? 'الكوبون منتهي' : 'استخدام الكوبون الآن'}</span>
                    </button>

                    {/* أزرار المشاركة */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShareMenuOpen(
                            shareMenuOpen === coupon.id ? null : coupon.id
                          )
                        }
                        className="w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                      >
                        <FiShare2 />
                        <span>مشاركة الكوبون</span>
                      </button>

                      {shareMenuOpen === coupon.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl p-4 z-10 border-2 border-gray-100"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleShare(coupon, 'whatsapp')}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all"
                            >
                              <FaWhatsapp className="text-xl" />
                              <span className="text-sm font-medium">واتساب</span>
                            </button>

                            <button
                              onClick={() => handleShare(coupon, 'twitter')}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-all"
                            >
                              <FaTwitter className="text-xl" />
                              <span className="text-sm font-medium">تويتر</span>
                            </button>

                            <button
                              onClick={() => handleShare(coupon, 'facebook')}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
                            >
                              <FaFacebook className="text-xl" />
                              <span className="text-sm font-medium">فيسبوك</span>
                            </button>

                            <button
                              onClick={() => handleShare(coupon, 'telegram')}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all"
                            >
                              <FaTelegram className="text-xl" />
                              <span className="text-sm font-medium">تلجرام</span>
                            </button>

                            <button
                              onClick={() => handleShare(coupon, 'copy')}
                              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
                            >
                              <FaLink className="text-xl" />
                              <span className="text-sm font-medium">نسخ الرابط</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* معلومات إضافية */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {coupon.expiry_date && (
                        <div
                          className={`flex items-center justify-center gap-2 text-sm ${
                            expired
                              ? 'text-gray-500'
                              : daysLeft <= 3
                              ? 'text-red-600 font-bold'
                              : 'text-gray-600'
                          }`}
                        >
                          <FiClock />
                          {expired ? (
                            <span>انتهى في {formatDate(coupon.expiry_date)}</span>
                          ) : daysLeft === 0 ? (
                            <span className="text-red-600 font-bold">
                              ينتهي اليوم!
                            </span>
                          ) : daysLeft === 1 ? (
                            <span className="text-orange-600 font-bold">
                              ينتهي غداً
                            </span>
                          ) : daysLeft <= 7 ? (
                            <span className="text-orange-600">
                              متبقي {daysLeft} أيام
                            </span>
                          ) : (
                            <span>
                              ينتهي في {formatDate(coupon.expiry_date)}
                            </span>
                          )}
                        </div>
                      )}

                      {coupon.commission && (
                        <div className="text-center mt-2">
                          <span className="text-xs text-gray-500">
                            💰 عمولة: {coupon.commission}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* نصيحة للمستخدمين */}
        {coupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-3">💡 كيفية الاستخدام</h3>
            <div className="flex flex-wrap justify-center gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-blue-600">
                  1
                </span>
                <span>اضغط لكشف الكود</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-blue-600">
                  2
                </span>
                <span>انسخ الكود تلقائياً</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-blue-600">
                  3
                </span>
                <span>اذهب للموقع وألصقه عند الدفع</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

// SSR
export async function getServerSideProps() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_WP_API_URL}/taplink/v1/coupons`;

    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
    });

    return {
      props: {
        initialCoupons: response.data || [],
      },
    };
  } catch (error) {
    console.error('❌ Error fetching coupons:', error.message);
    console.error('Full error:', error.response?.data || error);

    return {
      props: {
        initialCoupons: [],
      },
    };
  }
}
