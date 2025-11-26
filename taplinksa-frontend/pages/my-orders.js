import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const { addToCart, clearCart } = useCart();
const [reorderLoading, setReorderLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/my-orders');
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'on-hold': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusText = {
      'completed': 'مكتمل',
      'processing': 'قيد التجهيز',
      'pending': 'في انتظار الدفع',
      'cancelled': 'ملغي',
      'on-hold': 'معلق',
    };
    return statusText[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'completed': '✅',
      'processing': '⏳',
      'pending': '🕐',
      'cancelled': '❌',
      'on-hold': '⏸️',
    };
    return icons[status] || '📦';
  };

  if (!user) return null;

  if (loading) {
    return (
      <Layout title="طلباتي">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <p className="text-xl text-gray-600">جاري تحميل الطلبات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="طلباتي | تاب لينك السعودية">
     <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen pt-32 pb-12">
  <div className="container-custom">

          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-2">
              طلباتي 📦
            </h1>
            <p className="text-gray-600">عرض وتتبع جميع طلباتك السابقة</p>
          </motion.div>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gold to-yellow-400 p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-dark mb-1">
                          طلب #{order.number}
                        </h3>
                        <p className="text-dark/70">
                          {new Date(order.date_created).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-dark/70 mb-1">الإجمالي</p>
                        <p className="text-3xl font-bold text-dark">
                          {parseFloat(order.total).toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6">
                    {/* Status */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">
                        {getStatusIcon(order.status)}
                      </span>
                      <div>
                        <p className="text-sm text-gray-600">حالة الطلب</p>
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-bold text-dark mb-3">المنتجات:</h4>
                      {order.line_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image.src} 
                                alt={item.name} 
                                className="w-full h-full object-cover rounded-lg" 
                              />
                            ) : '💳'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-dark">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              الكمية: {item.quantity} × {parseFloat(item.price).toFixed(2)} ر.س
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gold text-lg">
                              {parseFloat(item.total).toFixed(2)} ر.س
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    {order.shipping && order.shipping.address_1 && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-dark mb-2 flex items-center gap-2">
                          <span>📍</span>
                          عنوان الشحن
                        </h4>
                        <p className="text-gray-700">
                          {order.shipping.first_name} {order.shipping.last_name}<br />
                          {order.shipping.address_1}<br />
                          {order.shipping.city}{order.shipping.state ? `, ${order.shipping.state}` : ''}<br />
                          {order.shipping.postcode && `الرمز البريدي: ${order.shipping.postcode}`}
                        </p>
                        {order.billing.phone && (
                          <p className="text-gray-700 mt-2">
                            📱 {order.billing.phone}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">المجموع الفرعي:</span>
                          <span className="font-medium">{parseFloat(order.total - order.total_tax - order.shipping_total).toFixed(2)} ر.س</span>
                        </div>
                        {parseFloat(order.shipping_total) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">الشحن:</span>
                            <span className="font-medium">{parseFloat(order.shipping_total).toFixed(2)} ر.س</span>
                          </div>
                        )}
                        {parseFloat(order.total_tax) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">الضريبة:</span>
                            <span className="font-medium">{parseFloat(order.total_tax).toFixed(2)} ر.س</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                          <span className="font-bold text-lg">الإجمالي:</span>
                          <span className="font-bold text-lg text-gold">{parseFloat(order.total).toFixed(2)} ر.س</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {order.status === 'completed' && (
                        <button 
                          onClick={() => {
                            // إضافة المنتجات للسلة
                            order.line_items.forEach(item => {
                              // addToCart logic here
                            });
                            router.push('/cart');
                          }}
                          className="flex-1 py-3 px-6 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
                        >
                          🔄 اطلب مرة أخرى
                        </button>
                      )}
                      
{order.status === 'pending' && (
  <button
    onClick={async () => {
      setReorderLoading(true);
      try {
        clearCart();
        
        for (const item of order.line_items) {
          const response = await fetch(`/api/products/${item.product_id}`);
          if (response.ok) {
            const product = await response.json();
            addToCart(product, item.quantity);
          }
        }
        
        router.push('/checkout');
      } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء تحميل الطلب');
        setReorderLoading(false);
      }
    }}
    disabled={reorderLoading}
    className="flex-1 py-3 px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {reorderLoading ? '⏳ جاري التحميل...' : '💳 أكمل الدفع'}
  </button>
)}



                      <a
                        href={`https://wa.me/966123456789?text=استفسار عن الطلب رقم ${order.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-6 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all text-center"
                      >
                        📱 تواصل معنا
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <div className="text-8xl mb-6">📦</div>
              <h2 className="text-3xl font-bold text-dark mb-4">
                لا توجد طلبات بعد
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                ابدأ التسوق واستمتع بمنتجاتنا الذكية!
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-4 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg"
              >
                🛍️ تصفح المتجر
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
