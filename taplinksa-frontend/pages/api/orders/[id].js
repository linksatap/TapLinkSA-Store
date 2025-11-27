import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // فك تشفير التوكن للحصول على البريد الإلكتروني
    const tokenParts = token.split('.');
    const payload = JSON.parse(
      Buffer.from(tokenParts[1], 'base64').toString('utf-8')
    );
    const userEmail = payload.name;

    // جلب الطلب
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/orders/${id}`,
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    const order = response.data;

    // التحقق من أن الطلب يخص هذا المستخدم
    if (order.billing.email !== userEmail) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch order',
      details: error.response?.data || error.message,
    });
  }
}
