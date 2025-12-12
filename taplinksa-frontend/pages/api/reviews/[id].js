// pages/api/reviews/[id].js
import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  // Base URL for WordPress API
  const WP_API_URL = process.env.WP_API_URL || 'https://cms.taplinksa.com';
  const WC_KEY = process.env.WC_CONSUMER_KEY;
  const WC_SECRET = process.env.WC_CONSUMER_SECRET;

  try {
    switch (method) {
      // GET: Fetch reviews for a product
      case 'GET': {
        const response = await axios.get(
          `${WP_API_URL}/wp-json/wc/v3/products/reviews`,
          {
            params: {
              product: id,
              per_page: 100,
              status: 'approved',
              consumer_key: WC_KEY,
              consumer_secret: WC_SECRET,
            },
          }
        );

        const reviews = response.data;

        // Calculate rating statistics
        const stats = {
          total: reviews.length,
          average: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };

        if (reviews.length > 0) {
          let sum = 0;
          reviews.forEach(review => {
            const rating = review.rating;
            sum += rating;
            stats.breakdown[rating]++;
          });
          stats.average = (sum / reviews.length).toFixed(1);
        }

        return res.status(200).json({
          success: true,
          reviews,
          stats,
        });
      }

      // POST: Create a new review
      case 'POST': {
        const { rating, review, reviewer, reviewer_email } = req.body;

        if (!rating || !review || !reviewer || !reviewer_email) {
          return res.status(400).json({
            success: false,
            message: 'جميع الحقول مطلوبة',
          });
        }

        const response = await axios.post(
          `${WP_API_URL}/wp-json/wc/v3/products/reviews`,
          {
            product_id: parseInt(id),
            rating: parseInt(rating),
            review,
            reviewer,
            reviewer_email,
          },
          {
            params: {
              consumer_key: WC_KEY,
              consumer_secret: WC_SECRET,
            },
          }
        );

        return res.status(201).json({
          success: true,
          review: response.data,
          message: 'تم إضافة تقييمك بنجاح',
        });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          message: `Method ${method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error('Reviews API Error:', error.response?.data || error.message);
    
    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'فشل في جلب التقييمات',
      error: error.response?.data || error.message,
    });
  }
}
