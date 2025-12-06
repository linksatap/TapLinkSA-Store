// pages/api/shop/products.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const {
      page = 1,
      category = null,
      search = '',
      sortBy = 'latest',
    } = req.query;

    // Get env vars
    const WC_API_URL = process.env.NEXT_PUBLIC_WC_API;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    console.log('🔍 Checking Environment Variables:');
    console.log('WC_API_URL:', WC_API_URL ? '✅ SET' : '❌ MISSING');
    console.log('WC_CONSUMER_KEY:', WC_CONSUMER_KEY ? '✅ SET' : '❌ MISSING');
    console.log('WC_CONSUMER_SECRET:', WC_CONSUMER_SECRET ? '✅ SET' : '❌ MISSING');

    // Validate
    if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('❌ Missing WooCommerce credentials');
      return res.status(500).json({
        error: 'Missing WooCommerce credentials in environment',
        data: [],
        total: 0,
        totalPages: 1,
      });
    }

    // Build query params
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', 20);
    params.append('status', 'publish');

    if (category) params.append('category', category);
    if (search) params.append('search', search);

    // Sorting
    switch (sortBy) {
      case 'popular':
        params.append('orderby', 'popularity');
        break;
      case 'price_asc':
        params.append('orderby', 'price');
        params.append('order', 'asc');
        break;
      case 'price_desc':
        params.append('orderby', 'price');
        params.append('order', 'desc');
        break;
      case 'rating':
        params.append('orderby', 'rating');
        break;
      default:
        params.append('orderby', 'date');
        params.append('order', 'desc');
    }

    const url = `${WC_API_URL}/products?${params.toString()}`;
    console.log(`📡 Calling WC API...`);

    // Create Basic Auth Header (Fix for Vercel)
    const basicAuth = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TapLink-Frontend/1.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ WC API Error ${response.status}:`);
      console.error(errorText.substring(0, 500)); // Log first 500 chars

      return res.status(response.status).json({
        error: `WooCommerce API error: ${response.status}`,
        data: [],
        total: 0,
        totalPages: 1,
      });
    }

    const products = await response.json();
    const total = parseInt(response.headers.get('x-wp-total') || '0');
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');

    console.log(`✅ Success: ${products.length} products`);

    return res.status(200).json({
      data: products,
      total,
      totalPages,
    });
  } catch (error) {
    console.error('❌ API Route Error:', error.message);

    return res.status(500).json({
      error: error.message,
      data: [],
      total: 0,
      totalPages: 1,
    });
  }
}
