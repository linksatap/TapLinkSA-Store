// pages/api/reviews/[productId].js - FIXED VERSION

export default async function handler(req, res) {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // GET - جلب التقييمات
  if (req.method === 'GET') {
    try {
      console.log('📥 Fetching reviews for product:', productId);
      
      const auth = Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
      ).toString('base64');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/products/${productId}/reviews?per_page=100`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('❌ API Error:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        return res.status(response.status).json({ 
          error: 'Failed to fetch reviews from WooCommerce',
          details: errorData
        });
      }

      const data = await response.json();
      console.log('✅ Reviews fetched successfully:', Array.isArray(data) ? data.length : 0);
      
      res.status(200).json(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching reviews:', error.message);
      res.status(500).json({ 
        error: 'Failed to fetch reviews',
        details: error.message 
      });
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

      const auth = Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
      ).toString('base64');

      const payload = {
        product_id: parseInt(productId),
        review: review.trim(),
        reviewer: reviewer.trim(),
        reviewer_email: reviewer_email.trim(),
        rating: parseInt(rating),
      };

      console.log('📊 Payload:', payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/products/${productId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error:', response.status, data);
        
        if (response.status === 401 || response.status === 403) {
          return res.status(403).json({ error: 'ليس لديك صلاحية لإضافة تقييم' });
        }

        return res.status(response.status).json({
          error: data.message || 'فشل إضافة التقييم',
          details: data,
        });
      }

      console.log('✅ Review added successfully:', data.id);
      res.status(201).json({
        success: true,
        review: data,
      });
    } catch (error) {
      console.error('❌ Error creating review:', error.message);
      res.status(500).json({
        error: 'فشل إضافة التقييم',
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}