import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';

export default function ThankYou() {
  const router = useRouter();
  const { cart } = useCart();
  const { 
    order_id, 
    order_number, 
    payment, 
    name, 
    phone, 
    email, 
    city, 
    address, 
    notes 
  } = router.query;
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [cartSnapshot, setCartSnapshot] = useState([]);

  useEffect(() => {
    if (order_id && order_number) {
      setOrderDetails({
        id: order_id,
        number: order_number,
        payment: payment || 'cod',
        name: name || '',
        phone: phone || '',
        email: email || '',
        city: city || '',
        address: address || '',
        notes: notes || '',
      });
    }
    
    // حفظ نسخة من السلة (إذا لم يتم مسحها بعد)
    if (cart && cart.length > 0) {
      setCartSnapshot(cart);
    }
  }, [order_id, order_number, payment, name, phone, email, city, address, notes, cart]);

  // دالة إرسال واتساب
  const sendWhatsApp = () => {
    if (!orderDetails) return;

    // إعداد رسالة واتساب
    let message = `*طلب جديد #${orderDetails.number}*%0A%0A`;
    message += `الاسم: ${orderDetails.name}%0A`;
    message += `📱 الجوال: ${orderDetails.phone}%0A`;
    message += `📧 البريد: ${orderDetails.email}%0A`;
    message += `📍 المدينة: ${orderDetails.city}%0A`;
    message += `🏠 العنوان: ${orderDetails.address}%0A`;
    message += `💳 طريقة الدفع: ${
      orderDetails.payment === 'cod' ? 'الدفع عند الاستلام' : 
      orderDetails.payment === 'bank' ? 'تحويل بنكي' : 
      'PayPal'
    }%0A%0A`;
    
    if (orderDetails.notes) {
      message += `*ملاحظات:* ${orderDetails.notes}%0A%0A`;
    }
    
    message += `*رقم الطلب:* ${orderDetails.number}%0A`;
    message += `رابط الطلب: https://cms.smartshopperz.com/wp-admin/post.php?post=${orderDetails.id}&action=edit`;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966507004339';
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <Layout title="شكراً لك | تاب لينك السعودية">
      <div className="container-custom section-padding">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl mb-6"
          >
            ✅
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            تم إنشاء طلبك بنجاح!
          </h1>

          {orderDetails && (
            <div className="bg-gold/10 p-6 rounded-2xl mb-8">
              <p className="text-xl font-bold mb-2">
                رقم الطلب: #{orderDetails.number}
              </p>
              <p className="text-gray-600">
                تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني
              </p>
            </div>
          )}

          <p className="text-xl text-gray-600 mb-8">
            شكراً لك على ثقتك بنا. سنتواصل معك قريباً لتأكيد الطلب
          </p>

          {/* زر واتساب المميز */}
          {orderDetails && (
            <motion.button
              onClick={sendWhatsApp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg mb-8 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>🚀 تسريع طلبك عبر واتساب</span>
            </motion.button>
          )}

          <div className="bg-blue-50 p-6 rounded-2xl mb-8">
            <h2 className="text-xl font-bold mb-4">📧 تحقق من بريدك الإلكتروني</h2>
            <p className="text-gray-700">
              تم إرسال تأكيد الطلب وتفاصيله إلى بريدك الإلكتروني
            </p>
          </div>

          <div className="bg-gold/10 p-6 rounded-2xl mb-8">
            <h2 className="text-xl font-bold mb-4">ماذا بعد؟</h2>
            <ul className="text-right space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">١</span>
                <span>تحقق من بريدك الإلكتروني لتفاصيل الطلب</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">٢</span>
                <span>يمكنك تسريع معالجة طلبك عبر إرسال رسالة واتساب</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">٣</span>
                <span>سنتواصل معك خلال 24 ساعة لتأكيد التفاصيل</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">٤</span>
                <span>سيتم شحن طلبك خلال 2-3 أيام عمل</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary">
              تصفح المزيد من المنتجات
            </Link>
            <Link href="/" className="btn-secondary">
              العودة للرئيسية
            </Link>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="mb-2">
              💡 <strong>نصيحة:</strong> استخدم زر "تسريع طلبك عبر واتساب" للتواصل المباشر معنا
            </p>
            <p>
              في حالة وجود أي استفسار، يمكنك التواصل معنا عبر واتساب أو البريد الإلكتروني
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
