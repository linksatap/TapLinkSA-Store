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

    // جلب بيانات المستخدم من WooCommerce
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/customers/${userId}`,
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}
