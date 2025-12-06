// pages/api/shop/categories.js

export default async function handler(req, res) {
  try {
    const WC_API_URL = process.env.NEXT_PUBLIC_WC_API;
    const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

    if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      return res.status(500).json({
        error: 'API credentials not configured',
        data: [],
      });
    }

    const url = `${WC_API_URL}/products/categories?per_page=100&hide_empty=true`;
    console.log('📡 Fetching categories...');

    const credentials = Buffer.from(
      `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Categories API Error: ${response.status}`);
      return res.status(response.status).json({
        error: `Error fetching categories: ${response.status}`,
        data: [],
      });
    }

    const categories = await response.json();
    console.log(`✅ Loaded ${categories.length} categories`);

    return res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.error('❌ Categories API error:', error.message);
    return res.status(500).json({
      error: error.message,
      data: [],
    });
  }
}
