// pages/api/reviews/[productId].js - QUERY PARAMS VERSION

export default async function handler(req, res) {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;
  const apiUrl = process.env.NEXT_PUBLIC_WC_API_URL;

  if (!consumerKey || !consumerSecret || !apiUrl) {
    console.error('❌ Missing environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error',
      missing: {
        key: !consumerKey,
        secret: !consumerSecret,
        url: !apiUrl
      }
    });
  }

  // GET - جلب التقييمات
  if (req.method === 'GET') {
    try {
      console.log('📥 Fetching reviews for product:', productId);
      console.log('🔗 API URL:', apiUrl);
      
      const url = `https://cms.taplinksa.com/wp-json/wc/v3/products/reviews?product=${productId}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
      
      console.log('📍 Requesting:', url.replace(consumerKey, 'KEY').replace(consumerSecret, 'SECRET'));

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, response.statusText);
        console.error('❌ Response Body:', errorText);
        
        return res.status(response.status).json({ 
          error: `WooCommerce API Error: ${response.statusText}`,
          status: response.status,
          details: errorText
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

      const payload = {
        product_id: parseInt(productId),
        review: review.trim(),
        reviewer: reviewer.trim(),
        reviewer_email: reviewer_email.trim(),
        rating: parseInt(rating),
      };

      console.log('📊 Payload:', payload);

      const url = `https://cms.taplinksa.com/wp-json/wc/v3/products/reviews?product=${productId}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Data:', data);

      if (!response.ok) {
        console.error('❌ API Error:', response.status, data);
        
        if (response.status === 401 || response.status === 403) {
          return res.status(403).json({ error: 'ليس لديك صلاحية لإضافة تقييم - تحقق من المفاتيح' });
        }

        return res.status(response.status).json({
          error: data.message || 'فشل إضافة التقييم',
          code: data.code,
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