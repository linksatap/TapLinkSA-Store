import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DigitalSubscriptionsBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg"
    >
      <div className="flex items-center gap-4 mb-4 md:mb-0">
       {/*  /*<span className="text-5xl">🎁</span>*/}
        <div>
          <h3 className="text-blue-900 font-bold text-lg mb-1">🔔 قسم الاشتراكات الرقمية</h3>
          <p className="text-blue-700 text-sm">اكتشف أفضل الاشتراكات لـ Canva Pro و Netflix بأسعار منخفضة</p>
        </div>
      </div>
      <Link href="/subscriptions" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold" scroll={false}>
        تصفح الآن →
      </Link>
    </motion.div>
  );
}
