import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import SubscriptionsGrid from '../../components/subscriptions/SubscriptionsGrid';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      console.log('🔍 Fetching subscriptions from API...');
      
      const response = await fetch('/api/subscriptions');
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch');
      }
      
      const data = await response.json();
      
      console.log('✅ Subscriptions received:', data.length);
      console.log('📦 First subscription:', data[0]);
      
      setSubscriptions(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching subscriptions:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // فلترة حسب المدة
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === 'all') return true;
    
    const duration = sub.meta_data?.find(
      (meta) => meta.key === '_subscription_duration'
    )?.value;
    
    if (filter === '1-month') return duration === '1';
    if (filter === '3-months') return duration === '3';
    if (filter === '12-months') return duration === '12';
    
    return true;
  });

  // تجميع حسب الأداة
  const toolNames = [...new Set(
    subscriptions.map((sub) => 
      sub.meta_data?.find((meta) => meta.key === '_subscription_tool_name')?.value || 'أخرى'
    )
  )];

  return (
    <Layout title="الاشتراكات الرقمية الرسمية 2025 | أفضل الأسعار - متجر تاب لينك "
      description="اشتراكات رسمية 100% ✓ ChatGPT Plus ✓ Canva Pro ✓ Midjourney ✓ سورسات تيليجرام ✓ تفعيل فوري ✓ دعم 24/7 في بريدة والقصيم"
      keywords="اشتراكات رقمية, ChatGPT اشتراك, Canva Pro,نيتفليكس,Netflix, Midjourney اشتراك, سورسات تيليجرام, اشتراكات رسمية, بريدة, القصيم, تاب لينك"
      ogImage="/images/subscriptions-og.jpg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gold via-yellow-400 to-yellow-500 py-20 mt-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6">
              الاشتراكات الرقمية الرسمية 🎯
            </h1>
            <p className="text-xl md:text-2xl text-dark/80 mb-8 max-w-3xl mx-auto">
              احصل على اشتراكات رسمية 100% لأشهر الأدوات والخدمات الرقمية بأفضل الأسعار
            </p>
            
            {/* Debug Info */}
            {loading && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
                <p className="text-dark">⏳ جاري التحميل...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 inline-block max-w-xl">
                <p className="text-red-800">❌ خطأ: {error}</p>
              </div>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-dark/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="text-4xl font-bold text-dark mb-1">
                  {subscriptions.length}
                </div>
                <div className="text-dark/80">اشتراك متاح</div>
              </div>
              
              <div className="bg-dark/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="text-4xl font-bold text-dark mb-1">
                  {toolNames.length}
                </div>
                <div className="text-dark/80">أداة وخدمة</div>
              </div>
              
              <div className="bg-dark/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="text-4xl font-bold text-dark mb-1">
                  100%
                </div>
                <div className="text-dark/80">رسمية ومضمونة</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-gray-600 hover:text-gold">الرئيسية</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gold font-bold">الاشتراكات الرقمية</li>
            </ol>
          </nav>

          {/* Filters */}
          {!loading && !error && subscriptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-bold text-dark">تصفية حسب المدة:</span>
                  
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-gold text-dark shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    الكل
                  </button>
                  
                  <button
                    onClick={() => setFilter('1-month')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      filter === '1-month'
                        ? 'bg-gold text-dark shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    شهر واحد
                  </button>
                  
                  <button
                    onClick={() => setFilter('3-months')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      filter === '3-months'
                        ? 'bg-gold text-dark shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    3 أشهر
                  </button>
                  
                  <button
                    onClick={() => setFilter('12-months')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      filter === '12-months'
                        ? 'bg-gold text-dark shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    12 شهر
                  </button>

                  <div className="mr-auto text-sm text-gray-600">
                    عرض {filteredSubscriptions.length} من {subscriptions.length} اشتراك
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subscriptions Grid */}
          <SubscriptionsGrid 
            subscriptions={filteredSubscriptions} 
            loading={loading} 
          />

          {/* Info Section */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-dark mb-6 text-center">
                لماذا تشتري من تاب لينك؟
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    اشتراكات رسمية 100%
                  </h3>
                  <p className="text-gray-600">
                    جميع اشتراكاتنا رسمية ومشتراة مباشرة من الشركات الأصلية
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    تفعيل فوري
                  </h3>
                  <p className="text-gray-600">
                    احصل على اشتراكك خلال دقائق من إتمام الطلب
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    دعم فني مستمر
                  </h3>
                  <p className="text-gray-600">
                    فريقنا متواجد على مدار الساعة لمساعدتك في أي استفسار
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
}
