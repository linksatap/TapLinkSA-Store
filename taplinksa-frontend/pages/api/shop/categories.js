// pages/api/shop/categories.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        'User-Agent': 'TapLink-Frontend/1.0',
      },
      timeout: 10000,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Categories API Error: ${response.status}`);
      console.error(errorText);

      return res.status(response.status).json({
        error: `Categories API error: ${response.status}`,
        data: [],
      });
    }

    const categories = await response.json();
    console.log(`✅ Loaded ${categories.length} categories`);

    return res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.error('❌ Categories API Error:', error);
    console.error('Stack:', error.stack);

    return res.status(500).json({
      error: error.message || 'Internal Server Error',
      data: [],
    });
  }
}
