import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/coupons`,
      {
        params: {
          per_page: 20,
          orderby: 'date',
          order: 'desc',
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    // فلترة الكوبونات الفعالة فقط
    const now = new Date();
    const activeCoupons = response.data.filter(coupon => {
      // تحقق من تاريخ الانتهاء
      if (coupon.date_expires && new Date(coupon.date_expires) < now) {
        return false;
      }
      
      // تحقق من حد الاستخدام
      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return false;
      }
      
      return true;
    });

    res.status(200).json(activeCoupons);
  } catch (error) {
    console.error('Error fetching coupons:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
}