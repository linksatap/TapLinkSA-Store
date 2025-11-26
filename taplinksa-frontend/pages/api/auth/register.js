import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    console.log('Creating customer:', { name, email });

    // ✅ الخطوة 1: إنشاء مستخدم في WooCommerce
    const customerResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/customers`,
      {
        email: email,
        first_name: name,
        username: email,
        password: password,
      },
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    const customerId = customerResponse.data.id;
    console.log('Customer created with ID:', customerId);

    // ✅ الخطوة 2: تسجيل دخول تلقائي
    const wpUrl = process.env.NEXT_PUBLIC_WC_API_URL.replace('/wp-json/wc/v3', '');
    
    const loginResponse = await axios.post(
      `${wpUrl}/wp-json/api/v1/token`,
      {
        username: email,
        password: password,
      }
    );

    const token = loginResponse.data.jwt_token || loginResponse.data.token;

    // ✅ الخطوة 3: إرجاع البيانات الكاملة
    const userData = {
      id: customerId, // ✅ استخدم ID من WooCommerce
      name: name,
      email: email,
    };

    console.log('Registration successful - User data:', userData);

    res.status(200).json({
      success: true,
      user: userData,
      token: token,
    });
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.message || 'فشل التسجيل';
    
    if (errorMessage.includes('email') || errorMessage.includes('البريد')) {
      return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    res.status(400).json({ error: errorMessage });
  }
}
