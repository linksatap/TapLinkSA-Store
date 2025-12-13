import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    // جلب جميع الكوبونات
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/coupons`,
      {
        params: {
          code: code,
          per_page: 1,
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({ 
        error: 'كود الخصم غير صحيح',
        valid: false 
      });
    }

    const coupon = response.data[0];

    // التحقق من صلاحية الكوبون
    const now = new Date();
    
    // تاريخ الانتهاء
    if (coupon.date_expires && new Date(coupon.date_expires) < now) {
      return res.status(400).json({ 
        error: 'انتهت صلاحية كود الخصم',
        valid: false 
      });
    }

    // حد الاستخدام
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ 
        error: 'تم استخدام هذا الكود بالكامل',
        valid: false 
      });
    }

    // الحد الأدنى للمبلغ
    const minimumAmount = parseFloat(coupon.minimum_amount || 0);

    res.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        amount: coupon.amount,
        discount_type: coupon.discount_type,
        description: coupon.description,
        minimum_amount: minimumAmount,
        maximum_amount: coupon.maximum_amount,
        free_shipping: coupon.free_shipping,
        expiry_date: coupon.date_expires,
        usage_limit: coupon.usage_limit,
        usage_count: coupon.usage_count,
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'فشل التحقق من كود الخصم',
      valid: false 
    });
  }
}
