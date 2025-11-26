import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderData } = req.body;
    
    // ✅ جلب user_id من localStorage أو من البيانات
    const customerId = orderData.customer_id || 0;
    
    console.log('📦 Creating order with customer_id:', customerId);
    console.log('Order data:', {
      customer_id: customerId,
      email: orderData.email,
      name: orderData.name,
      items: orderData.items?.length || 0
    });

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'السلة فارغة',
      });
    }

    // ✅ تحضير بيانات الطلب
    const wooCommerceOrder = {
      customer_id: customerId, // ✅ مهم جداً!
      payment_method: orderData.paymentMethod === 'cod' ? 'cod' : 
                     orderData.paymentMethod === 'bank' ? 'bacs' : 'paypal',
      payment_method_title: orderData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' :
                           orderData.paymentMethod === 'bank' ? 'تحويل بنكي' : 'PayPal',
      set_paid: orderData.paid || false,
      status: orderData.paid ? 'processing' : 'pending',
      billing: {
        first_name: orderData.name.split(' ')[0] || orderData.name,
        last_name: orderData.name.split(' ').slice(1).join(' ') || '',
        email: orderData.email,
        phone: orderData.phone,
        address_1: orderData.address,
        city: orderData.city,
        country: 'SA',
      },
      shipping: {
        first_name: orderData.name.split(' ')[0] || orderData.name,
        last_name: orderData.name.split(' ').slice(1).join(' ') || '',
        address_1: orderData.address,
        city: orderData.city,
        country: 'SA',
      },
      line_items: orderData.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity || 1,
      })),
      customer_note: orderData.notes || '',
    };

    console.log('📤 Sending to WooCommerce:', JSON.stringify(wooCommerceOrder, null, 2));

    // ✅ إرسال الطلب إلى WooCommerce
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/orders`,
      wooCommerceOrder,
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    console.log('✅ Order created successfully!');
    console.log('Order details:', {
      order_id: response.data.id,
      order_number: response.data.number,
      customer_id: response.data.customer_id,
      status: response.data.status,
      total: response.data.total
    });

    res.status(200).json({
      success: true,
      orderId: response.data.id,
      orderNumber: response.data.number,
      message: 'تم إنشاء الطلب بنجاح',
    });
  } catch (error) {
    console.error('❌ Error creating order:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'فشل إنشاء الطلب',
      error: error.message,
    });
  }
}
