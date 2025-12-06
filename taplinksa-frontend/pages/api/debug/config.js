// pages/api/debug/config.js

export default function handler(req, res) {
  // ⚠️ REMOVE THIS IN PRODUCTION!
  // This is only for debugging

  const WC_API_URL = process.env.NEXT_PUBLIC_WC_API;
  const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  return res.status(200).json({
    WC_API_URL: WC_API_URL || 'NOT SET',
    WC_CONSUMER_KEY: WC_CONSUMER_KEY 
      ? `${WC_CONSUMER_KEY.substring(0, 5)}...` 
      : 'NOT SET',
    WC_CONSUMER_SECRET: WC_CONSUMER_SECRET 
      ? `${WC_CONSUMER_SECRET.substring(0, 5)}...` 
      : 'NOT SET',
  });
}
