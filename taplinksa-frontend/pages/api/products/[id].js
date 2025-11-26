import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/products/${id}`,
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching product:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}
