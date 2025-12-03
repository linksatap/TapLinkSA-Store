import axios from "axios";

export default async function handler(req, res) {
  try {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`;
    const r = await axios.get(url, {
      auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET,
      },
      params: { per_page: 5 }
    });

    res.status(200).json({ url, products: r.data });
  } catch (e) {
    res.status(200).json({ 
      error: e.message,
      url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
      details: e?.response?.data 
    });
  }
}
