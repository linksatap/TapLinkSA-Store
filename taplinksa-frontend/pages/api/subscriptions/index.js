import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Fetching ALL products...');

    // ✅ جلب جميع المنتجات
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/products`,
      {
        params: {
          status: 'publish',
          per_page: 100,
          orderby: 'date',
          order: 'desc',
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    console.log(`📦 Total products: ${response.data.length}`);

    // ✅ فلترة المنتجات حسب التصنيف
    const subscriptions = response.data.filter((product) => {
      const categories = product.categories || [];
      
      const hasSubscriptionCategory = categories.some((cat) => {
        console.log(`  - Category: ${cat.name} (${cat.slug})`);
        return (
          cat.slug === 'digital-subscriptions' ||
          cat.slug === 'الاشتراكات-الرقمية' ||
          cat.name.includes('اشتراك') ||
          cat.name.includes('رقمي')
        );
      });

      if (hasSubscriptionCategory) {
        console.log(`  ✅ Product "${product.name}" is a subscription`);
      }

      return hasSubscriptionCategory;
    });

    console.log(`✅ Filtered subscriptions: ${subscriptions.length}`);

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch subscriptions',
      details: error.response?.data || error.message,
    });
  }
}
