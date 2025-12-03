import axios from "axios";

export default async function handler(req, res) {
  try {
    const r = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products`,
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        params: { per_page: 5 },
      }
    );

    res.status(200).json(r.data);
  } catch (e) {
    res.status(200).json({ error: e.message, response: e?.response?.data });
  }
}
