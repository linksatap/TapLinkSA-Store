import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { useUser } from '../../context/UserContext';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/order/' + id);
      return;
    }

    if (id) {
      fetchOrder();
    }
  }, [id, user]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('فشل جلب تفاصيل الطلب');
      }

      const data = await response.json();
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'on-hold': 'bg-orange-100 text-orange-800 border-orange-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'refunded': 'bg-gray-100 text-gray-800 border-gray-300',
      'failed': 'bg-red-100 text-red-800 border-red-300',
      'wc-awaiting-activation': 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'قيد الانتظار',
      'processing': 'قيد المعالجة',
      'on-hold': 'معلق',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      'refunded': 'مسترد',
      'failed': 'فشل',
      'wc-awaiting-activation': 'في انتظار التفعيل',
    };
    return statusTexts[status] || status;
  };

  const handlePrint = () => {
    window.print();
  };

  if (!user) return null;

  if (loading) {
    return (
      <Layout title="جاري التحميل...">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <p className="text-xl text-gray-600">جاري تحميل تفاصيل الطلب...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout title="خطأ">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
          <div className="text-center">
            <div className="text-8xl mb-4">❌</div>
            <h1 className="text-3xl font-bold mb-4">لم يتم العثور على الطلب</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/my-orders" className="btn-primary">
              العودة إلى طلباتي
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`الطلب #${order.number}`}>
      <div className="bg-gray-50 min-h-screen pt-32 pb-12">
        <div className="container-custom">
          
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm print:hidden">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-gray-600 hover:text-gold">الرئيسية</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/my-orders" className="text-gray-600 hover:text-gold">طلباتي</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gold font-bold">الطلب #{order.number}</li>
            </ol>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-dark mb-2">
                  الطلب #{order.number}
                </h1>
                <p className="text-gray-600">
                  تم الطلب في: {new Date(order.date_created).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="flex gap-4 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-gray-100 text-dark font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  🖨️ طباعة الفاتورة
                </button>
                <Link
                  href="/my-orders"
                  className="px-6 py-3 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition-all"
                >
                  ← العودة
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-6">حالة الطلب</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`px-6 py-3 rounded-xl font-bold border-2 ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-6">
                    {/* Order Placed */}
                    <div className="relative flex gap-4">
                      <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="flex-grow pb-6">
                        <p className="font-bold text-dark">تم تقديم الطلب</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date_created).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>

                    {/* Processing */}
                    {['processing', 'completed', 'wc-awaiting-activation'].includes(order.status) && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div className="flex-grow pb-6">
                          <p className="font-bold text-dark">قيد المعالجة</p>
                          <p className="text-sm text-gray-600">جاري تجهيز طلبك</p>
                        </div>
                      </div>
                    )}

                    {/* Shipped / Awaiting Activation */}
                    {order.status === 'wc-awaiting-activation' && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-sm">⏳</span>
                        </div>
                        <div className="flex-grow pb-6">
                          <p className="font-bold text-dark">في انتظار التفعيل</p>
                          <p className="text-sm text-gray-600">سيتم تفعيل اشتراكك قريباً</p>
                        </div>
                      </div>
                    )}

                    {/* Completed */}
                    {order.status === 'completed' && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-dark">تم التسليم</p>
                          <p className="text-sm text-gray-600">
                            {order.date_completed ? new Date(order.date_completed).toLocaleDateString('ar-SA') : 'مكتمل'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Cancelled */}
                    {order.status === 'cancelled' && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✕</span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-dark">تم الإلغاء</p>
                          <p className="text-sm text-gray-600">الطلب ملغي</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-6">المنتجات</h2>
                
                <div className="space-y-6">
                  {order.line_items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                        {item.image?.src ? (
                          <Image
                            src={item.image.src}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            📦
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-dark mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">الكمية: {item.quantity}</p>
                        <p className="text-lg font-bold text-gold">
                          {parseFloat(item.total).toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-6">ملخص الطلب</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع الفرعي:</span>
                    <span className="font-medium">{parseFloat(order.total).toFixed(2)} ر.س</span>
                  </div>
                  
                  {parseFloat(order.shipping_total) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>الشحن:</span>
                      <span className="font-medium">{parseFloat(order.shipping_total).toFixed(2)} ر.س</span>
                    </div>
                  )}
                  
                  {parseFloat(order.discount_total) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم:</span>
                      <span className="font-medium">-{parseFloat(order.discount_total).toFixed(2)} ر.س</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between text-xl font-bold">
                      <span>الإجمالي:</span>
                      <span className="text-gold">{parseFloat(order.total).toFixed(2)} ر.س</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-6">عنوان الشحن</h2>
                
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">{order.shipping.first_name} {order.shipping.last_name}</p>
                  <p>{order.shipping.address_1}</p>
                  {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                  <p>{order.shipping.city}, {order.shipping.state}</p>
                  <p>{order.shipping.postcode}</p>
                  <p>{order.shipping.country}</p>
                  {order.billing.phone && (
                    <p className="pt-2 mt-2 border-t">
                      📱 {order.billing.phone}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-6">طريقة الدفع</h2>
                <p className="text-gray-700">{order.payment_method_title}</p>
              </motion.div>

            </div>

          </div>

        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .container-custom, .container-custom * {
            visibility: visible;
          }
          .container-custom {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}
