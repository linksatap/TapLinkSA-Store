import axios from 'axios';

export default async function handler(req, res) {
  const { productId } = req.query;

  // GET - جلب التقييمات
  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/products/reviews`,
        {
          params: {
            product: productId,
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
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'يجب تسجيل الدخول لإضافة تقييم' });
      }

      // فك تشفير التوكن
      const tokenParts = token.split('.');
      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString('utf-8')
      );
      
      const userEmail = payload.name;

      const { rating, review, reviewer } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5' });
      }

      if (!review || review.trim().length < 10) {
        return res.status(400).json({ error: 'المراجعة يجب أن تكون 10 أحرف على الأقل' });
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/products/reviews`,
        {
          product_id: parseInt(productId),
          review: review,
          reviewer: reviewer || 'عميل',
          reviewer_email: userEmail,
          rating: parseInt(rating),
        },
        {
          auth: {
            username: process.env.WC_CONSUMER_KEY,
            password: process.env.WC_CONSUMER_SECRET,
          },
        }
      );

      res.status(200).json({ 
        success: true,
        review: response.data 
      });
    } catch (error) {
      console.error('Error creating review:', error.response?.data || error.message);
      
      if (error.response?.data?.code === 'woocommerce_rest_comment_exists') {
        return res.status(400).json({ error: 'لقد قمت بتقييم هذا المنتج من قبل' });
      }
      
      res.status(500).json({ 
        error: 'فشل إضافة التقييم',
        details: error.response?.data?.message 
      });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
