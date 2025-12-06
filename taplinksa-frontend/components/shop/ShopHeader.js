import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShopHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-gray-600">
          <li>
            <Link href="/" className="hover:text-gold transition-colors">
              الرئيسية
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gold font-semibold">المتجر</li>
        </ol>
      </nav>

      {/* Page Title */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          تصفح منتجاتنا
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-1 bg-gold mx-auto"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-600 text-lg max-w-3xl mx-auto"
        >
          اكتشف مجموعة واسعة من الاشتراكات والخدمات الرقمية بأفضل الأسعار
        </motion.p>
      </div>
    </motion.div>
  );
}
