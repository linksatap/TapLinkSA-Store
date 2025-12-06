// pages/api/reviews/[productId].js - Working Version

import axios from 'axios';

export default async function handler(req, res) {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // GET - جلب التقييمات
  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/products/${productId}/reviews`,
        {
          params: {
            per_page: 100,
          },
          auth: {
            username: process.env.WC_CONSUMER_KEY,
            password: process.env.WC_CONSUMER_SECRET,
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  // POST - إضافة تقييم جديد
  else if (req.method === 'POST') {
    try {
      const { rating, review, reviewer, reviewer_email } = req.body;

      // التحقق من البيانات المطلوبة
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5' });
      }

      if (!review || review.trim().length < 10) {
        return res.status(400).json({ error: 'التقييم يجب أن يكون 10 أحرف على الأقل' });
      }

      if (!reviewer || reviewer.trim().length === 0) {
        return res.status(400).json({ error: 'الاسم مطلوب' });
      }

      if (!reviewer_email || reviewer_email.trim().length === 0) {
        return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
      }

      // التحقق من صيغة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(reviewer_email)) {
        return res.status(400).json({ error: 'البريد الإلكتروني غير صحيح' });
      }

      console.log('📝 Adding review for product:', productId);
      console.log('📊 Review data:', { rating, reviewer, reviewer_email });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/products/${productId}/reviews`,
        {
          product_id: parseInt(productId),
          review: review.trim(),
          reviewer: reviewer.trim(),
          reviewer_email: reviewer_email.trim(),
          rating: parseInt(rating),
        },
        {
          auth: {
            username: process.env.WC_CONSUMER_KEY,
            password: process.env.WC_CONSUMER_SECRET,
          },
        }
      );

      console.log('✅ Review added successfully:', response.data.id);

      res.status(201).json({
        success: true,
        review: response.data,
      });
    } catch (error) {
      console.error('Error creating review:', error.response?.status, error.response?.data || error.message);

      // معالجة الأخطاء المختلفة
      if (error.response?.status === 404) {
        return res.status(404).json({ error: 'المنتج غير موجود' });
      }

      if (error.response?.data?.code === 'woocommerce_rest_comment_exists') {
        return res.status(400).json({ error: 'لقد قمت بتقييم هذا المنتج من قبل' });
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        return res.status(403).json({ error: 'ليس لديك صلاحية لإضافة تقييم' });
      }

      res.status(500).json({
        error: 'فشل إضافة التقييم',
        details: error.response?.data?.message || error.message,
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}