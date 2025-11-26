


import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // فك تشفير التوكن
    const tokenParts = token.split('.');
    const payload = JSON.parse(
      Buffer.from(tokenParts[1], 'base64').toString('utf-8')
    );
    
    const userId = payload.sub;
    const userEmail = payload.name; // البريد الإلكتروني

    console.log('Fetching orders for user:', { userId, userEmail });

    // ✅ الحل: جلب جميع الطلبات ثم الفلترة
    const allOrdersResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/orders`,
      {
        params: {
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

    // ✅ فلتر الطلبات: إما customer_id أو billing.email
    // في my-orders.js - إضافة Cache
const userOrders = allOrdersResponse.data.filter(order => 
  order.customer_id === userId || 
  order.billing.email?.toLowerCase() === userEmail.toLowerCase()
);

    console.log(`Found ${userOrders.length} orders for user ${userId} / ${userEmail}`);

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}


