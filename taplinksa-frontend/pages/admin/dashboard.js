import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activePromotions: 0,
    activePopups: 0
  });

  // ✅ التحقق من صلاحيات المدير
  useEffect(() => {
    if (!user || user.role !== 'administrator') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'administrator') {
    return null;
  }

  return (
    <AdminLayout title="لوحة التحكم">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مرحباً {user.name} 👋</h1>
        <p className="text-gray-600">إليك نظرة عامة على متجرك</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="📦"
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          color="bg-blue-500"
        />
        <StatCard
          icon="💰"
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toFixed(2)} ر.س`}
          color="bg-green-500"
        />
        <StatCard
          icon="🎁"
          title="العروض النشطة"
          value={stats.activePromotions}
          color="bg-purple-500"
        />
        <StatCard
          icon="🪟"
          title="النوافذ المنبثقة"
          value={stats.activePopups}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          icon="⚙️"
          title="إعدادات الشحن والضريبة"
          description="تحكم في أسعار الشحن والضريبة"
          href="/admin/settings"
          color="border-blue-500"
        />
        <QuickActionCard
          icon="🎉"
          title="إدارة العروض"
          description="إضافة وتعديل العروض والكوبونات"
          href="/admin/promotions"
          color="border-purple-500"
        />
        <QuickActionCard
          icon="🪟"
          title="النوافذ المنبثقة"
          description="إنشاء وإدارة النوافذ المنبثقة"
          href="/admin/popups"
          color="border-orange-500"
        />
      </div>
    </AdminLayout>
  );
}

// Stats Card Component
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

// Quick Action Card
function QuickActionCard({ icon, title, description, href, color }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`block bg-white rounded-xl shadow-lg p-6 border-2 ${color} hover:shadow-xl transition-all`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.a>
  );
}
