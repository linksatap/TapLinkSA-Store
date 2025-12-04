// components/seo/CouponSchema.js

import Head from 'next/head';

/**
 * مكون لإنشاء Schema Markup للكوبونات والعروض
 * يستخدم نوع Offer من Schema.org
 * 
 * @param {Object} coupon - بيانات الكوبون
 * @param {string} coupon.code - كود الخصم
 * @param {string} coupon.storeName - اسم المتجر صاحب الكوبون
 * @param {string} coupon.discountValue - قيمة الخصم (مثل "15%")
 * @param {string} coupon.description - وصف العرض
 * @param {string} coupon.validFrom - تاريخ بداية الصلاحية (ISO 8601)
 * @param {string} coupon.validThrough - تاريخ نهاية الصلاحية (ISO 8601)
 * @param {string} coupon.url - رابط الكوبون في موقعك
 * @param {string} coupon.storeUrl - رابط المتجر الخارجي
 */
export default function CouponSchema({ coupon }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taplinksa.com';

  const couponJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: `كود خصم ${coupon.storeName} ${coupon.discountValue}`,
    description: coupon.description,
    url: coupon.url,
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: '0',
      priceCurrency: 'SAR',
    },
    // كود الخصم
    promoCode: coupon.code,
    // تاريخ الصلاحية
    validFrom: coupon.validFrom,
    validThrough: coupon.validThrough,
    // المتجر صاحب العرض
    seller: {
      '@type': 'Organization',
      name: coupon.storeName,
      url: coupon.storeUrl,
    },
    // المنصة التي تقدم الكوبون
    offeredBy: {
      '@type': 'Organization',
      name: 'تاب لينك السعودية',
      url: siteUrl,
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(couponJsonLd) }}
      />
    </Head>
  );
}

/**
 * مثال على الاستخدام في صفحة الكوبون:
 * 
 * import CouponSchema from '@/components/seo/CouponSchema';
 * 
 * const couponData = {
 *   code: 'SAVE15',
 *   storeName: 'نون',
 *   discountValue: '15%',
 *   description: 'احصل على خصم 15% على جميع المنتجات من متجر نون',
 *   validFrom: '2025-01-01T00:00:00+03:00',
 *   validThrough: '2025-12-31T23:59:59+03:00',
 *   url: 'https://taplinksa.com/coupons/noon',
 *   storeUrl: 'https://www.noon.com',
 * };
 * 
 * <CouponSchema coupon={couponData} />
 */
