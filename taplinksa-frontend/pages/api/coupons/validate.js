export default async function handler(req, res) {
  // ✅ السماح فقط بـ POST
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

    // ✅ كوبونات ثابتة (للاختبار)
    const coupons = {
      'جديد': {
        code: 'جديد',
        type: 'percent',
        amount: 20,
        minimum_amount: 0,
        maximum_amount: null,
        description: 'خصم 20% على جميع المنتجات',
        free_shipping: false,
      },
      'SAVE50': {
        code: 'SAVE50',
        type: 'fixed',
        amount: 50,
        minimum_amount: 200,
        maximum_amount: null,
        description: 'خصم 50 ريال على طلبك',
        free_shipping: false,
      },
      'FREESHIP': {
        code: 'FREESHIP',
        type: 'free_shipping',
        amount: 0,
        minimum_amount: 0,
        maximum_amount: null,
        description: 'شحن مجاني لطلبك',
        free_shipping: true,
      },
      'VIP30': {
        code: 'VIP30',
        type: 'percent',
        amount: 30,
        minimum_amount: 500,
        maximum_amount: 150,
        description: 'خصم 30% (حد أقصى 150 ريال)',
        free_shipping: false,
      },
    };

    // البحث عن الكوبون
    const upperCode = code.toUpperCase().trim();
    const coupon = coupons[upperCode] || coupons[code];

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'كود الكوبون غير صحيح',
      });
    }

    // ✅ التحقق من الحد الأدنى
    if (coupon.minimum_amount > 0 && subtotal < coupon.minimum_amount) {
      return res.status(400).json({
        success: false,
        message: `الحد الأدنى للطلب ${coupon.minimum_amount} ر.س`,
      });
    }

    // ✅ حساب قيمة الخصم
    let discountAmount = 0;

    if (coupon.type === 'percent') {
      // خصم نسبة مئوية
      discountAmount = (subtotal * coupon.amount) / 100;

      // التحقق من الحد الأقصى للخصم
      if (coupon.maximum_amount && discountAmount > coupon.maximum_amount) {
        discountAmount = coupon.maximum_amount;
      }
    } else if (coupon.type === 'fixed') {
      // خصم مبلغ ثابت
      discountAmount = Math.min(coupon.amount, subtotal);
    }

    // ✅ إرجاع بيانات الكوبون
    return res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        description: coupon.description,
        free_shipping: coupon.free_shipping,
        minimum_amount: coupon.minimum_amount,
        maximum_amount: coupon.maximum_amount,
      },
      message: 'تم التحقق من الكوبون بنجاح',
    });

  } catch (error) {
    console.error('❌ Coupon validation error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من الكوبون',
      error: error.message,
    });
  }
}
