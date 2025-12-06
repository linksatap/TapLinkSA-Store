// pages/api/reviews/add.js

import { addProductReview } from '../../../lib/woocommerce';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, name, email, title, comment, rating } = req.body;

    // Validate required fields
    if (!productId || !name || !email || !title || !comment || !rating) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير صحيح' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5' });
    }

    // Build auth header for WooCommerce
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('Missing WooCommerce credentials');
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
    const headers = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    // Add review using WooCommerce API
    const result = await addProductReview(
      productId,
      { name, email, title, comment, rating },
      headers
    );

    if (!result.success) {
      return res.status(400).json({ 
        error: result.error || 'فشل إضافة التقييم' 
      });
    }

    return res.status(201).json({
      success: true,
      message: 'تم إضافة التقييم بنجاح',
      review: result.review,
    });
  } catch (error) {
    console.error('Error in add review API:', error);
    return res.status(500).json({ 
      error: 'خطأ في الخادم: ' + error.message 
    });
  }
}