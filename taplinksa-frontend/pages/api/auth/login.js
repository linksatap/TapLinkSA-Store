import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    console.log('Attempting login for:', email);

    // ✅ الخطوة 1: تسجيل الدخول والحصول على التوكن
    const wpUrl = process.env.NEXT_PUBLIC_WC_API_URL.replace('/wp-json/wc/v3', '');
    
    const tokenResponse = await axios.post(
      `${wpUrl}/wp-json/api/v1/token`,
      {
        username: email,
        password: password,
      }
    );

    const token = tokenResponse.data.jwt_token || tokenResponse.data.token;
    
    // ✅ الخطوة 2: فك تشفير التوكن للحصول على user_id
    const tokenParts = token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
    const userId = payload.sub;

    console.log('Token payload:', payload);
    console.log('User ID from token:', userId);

    // ✅ الخطوة 3: جلب بيانات المستخدم من WooCommerce
    let userName = payload.name || email;
    
    try {
      const customerResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/customers/${userId}`,
        {
          auth: {
            username: process.env.WC_CONSUMER_KEY,
            password: process.env.WC_CONSUMER_SECRET,
          },
        }
      );

      userName = customerResponse.data.first_name || customerResponse.data.username || email;
      console.log('Customer data fetched:', customerResponse.data.first_name);
    } catch (error) {
      console.log('Could not fetch customer data, using email as name');
    }

    // ✅ الخطوة 4: إرجاع البيانات الكاملة
    const userData = {
      id: userId, // ✅ مهم جداً!
      name: userName,
      email: email,
    };

    console.log('Login successful - User data:', userData);

    res.status(200).json({
      success: true,
      user: userData,
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    
    res.status(401).json({
      success: false,
      error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    });
  }
}
