import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link'; // ✅ أضف هذا السطر
import Layout from '../components/layout/Layout';
import { useUser } from '../context/UserContext';

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    // تحميل بيانات المستخدم من WooCommerce
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.billing?.phone || '',
          address: data.billing?.address_1 || '',
          city: data.billing?.city || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل التحديث');
      }

      // تحديث بيانات المستخدم في Context
      updateUser({
        ...user,
        name: formData.first_name,
      });

      setSuccess('✅ تم تحديث البيانات بنجاح!');
      setLoading(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout title="حسابي | تاب لينك السعودية">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-32 pb-12">
        <div className="container-custom max-w-2xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-gold to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-dark">
                {user.name?.charAt(0) || '👤'}
              </div>
              <h1 className="text-3xl font-bold text-dark mb-2">
                الملف الشخصي
              </h1>
              <p className="text-gray-600">تحديث معلوماتك الشخصية</p>
            </div>

            {/* Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-600 text-center"
              >
                {success}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    الاسم الأول *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    الاسم الأخير
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  المدينة
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all"
                >
                  <option value="">اختر المدينة</option>
                  <option value="بريدة">بريدة</option>
                  <option value="عنيزة">عنيزة</option>
                  <option value="الرس">الرس</option>
                  <option value="المذنب">المذنب</option>
                  <option value="البكيرية">البكيرية</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  العنوان
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all resize-none"
                  placeholder="الحي، الشارع، رقم المبنى..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gold text-dark hover:bg-yellow-500 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
              </motion.button>
            </form>

            {/* روابط إضافية */}
            <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
              <Link
                href="/my-orders"
                className="text-center py-3 px-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-medium"
              >
                📦 طلباتي
              </Link>
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.push('/');
                  }
                }}
                className="py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"
              >
                🚪 تسجيل الخروج
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
