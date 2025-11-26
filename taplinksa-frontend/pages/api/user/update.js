import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
    const { first_name, last_name, phone, address, city } = req.body;

    console.log('Updating user:', userId, req.body);

    // تحديث بيانات المستخدم في WooCommerce
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/customers/${userId}`,
      {
        first_name,
        last_name,
        billing: {
          first_name,
          last_name,
          phone,
          address_1: address,
          city,
          country: 'SA',
        },
        shipping: {
          first_name,
          last_name,
          address_1: address,
          city,
          country: 'SA',
        },
      },
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    console.log('User updated successfully');

    res.status(200).json({
      success: true,
      user: response.data,
    });
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.response?.data?.message || error.message
    });
  }
}
