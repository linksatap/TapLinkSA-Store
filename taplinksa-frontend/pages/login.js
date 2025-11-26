import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // إذا كان المستخدم مسجل دخول، وجهه للصفحة المطلوبة
    if (user) {
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <Layout title="تسجيل الدخول | تاب لينك السعودية">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-6xl mb-4"
              >
                🔐
              </motion.div>
              <h1 className="text-3xl font-bold text-dark mb-2">
                مرحباً بعودتك!
              </h1>
              <p className="text-gray-600">سجل دخولك للمتابعة</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit */}
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
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">أو</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="text-gold font-bold hover:text-yellow-600">
                  سجل الآن
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-gray-600 hover:text-gold transition-colors">
              ← العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
