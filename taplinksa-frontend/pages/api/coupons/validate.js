import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// ✅ إنشاء اتصال WooCommerce
const WooCommerce = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: 'wc/v3',
});

export default async function handler(req, res) {
  // السماح فقط بـ POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { code, subtotal } = req.body;

    // التحقق من البيانات
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كود الكوبون',
      });
    }

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'المجموع الفرعي غير صحيح',
      });
    }

    console.log('🔍 Searching for coupon:', code);

    // ✅ البحث عن الكوبون في WooCommerce
    const response = await WooCommerce.get('coupons', {
      code: code.toUpperCase(),
      per_page: 1,
    });

    const coupons = response.data;

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'كود الكوبون غير صحيح',
      });
    }

    const coupon = coupons[0];
    console.log('✅ Coupon found:', coupon.code);

    // ✅ التحقق من صلاحية الكوبون

    // 1. التحقق من تاريخ الانتهاء
    if (coupon.date_expires) {
      const expiryDate = new Date(coupon.date_expires);
      const now = new Date();
      if (now > expiryDate) {
        return res.status(400).json({
          success: false,
          message: 'انتهت صلاحية هذا الكوبون',
        });
      }
    }

    // 2. التحقق من عدد مرات الاستخدام
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'تم استخدام هذا الكوبون بالكامل',
      });
    }

    // 3. التحقق من الحد الأدنى للطلب
    const minAmount = parseFloat(coupon.minimum_amount || 0);
    if (minAmount > 0 && subtotal < minAmount) {
      return res.status(400).json({
        success: false,
        message: `الحد الأدنى للطلب ${minAmount.toFixed(2)} ر.س`,
      });
    }

    // 4. التحقق من الحد الأقصى للطلب
    const maxAmount = parseFloat(coupon.maximum_amount || 0);
    if (maxAmount > 0 && subtotal > maxAmount) {
      return res.status(400).json({
        success: false,
        message: `الحد الأقصى للطلب ${maxAmount.toFixed(2)} ر.س`,
      });
    }

    // ✅ حساب قيمة الخصم
    let discountAmount = 0;

    if (coupon.discount_type === 'percent') {
      // خصم نسبة مئوية
      discountAmount = (subtotal * parseFloat(coupon.amount)) / 100;
      
      // التحقق من الحد الأقصى للخصم
      const maxDiscount = parseFloat(coupon.maximum_amount || 0);
      if (maxDiscount > 0 && discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    } else if (coupon.discount_type === 'fixed_cart') {
      // خصم مبلغ ثابت على السلة
      discountAmount = parseFloat(coupon.amount);
      
      // التأكد من عدم تجاوز قيمة السلة
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    } else if (coupon.discount_type === 'fixed_product') {
      // خصم على منتج محدد
      discountAmount = parseFloat(coupon.amount);
    }

    // ✅ إرجاع معلومات الكوبون
    return res.status(200).json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.discount_type,
        amount: parseFloat(coupon.amount),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        description: coupon.description || `خصم ${coupon.amount}${coupon.discount_type === 'percent' ? '%' : ' ر.س'}`,
        free_shipping: coupon.free_shipping || false,
        minimum_amount: parseFloat(coupon.minimum_amount || 0),
        maximum_amount: parseFloat(coupon.maximum_amount || 0),
        date_expires: coupon.date_expires,
        usage_count: coupon.usage_count,
        usage_limit: coupon.usage_limit,
        individual_use: coupon.individual_use,
      },
      message: 'تم التحقق من الكوبون بنجاح',
    });

  } catch (error) {
    console.error('❌ Coupon validation error:', error);
    
    // التعامل مع أخطاء WooCommerce API
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'حدث خطأ في التحقق من الكوبون';
      
      if (status === 404) {
        return res.status(404).json({
          success: false,
          message: 'كود الكوبون غير صحيح',
        });
      }
      
      return res.status(status).json({
        success: false,
        message: message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من الكوبون',
      error: error.message,
    });
  }
}
