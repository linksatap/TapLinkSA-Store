import { motion } from 'framer-motion';

export default function ShopHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-8 md:py-12 px-4 md:px-6 rounded-lg mb-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">متجرنا</h1>
        <p className="text-teal-100 text-lg max-w-2xl">
          اكتشف أفضل العروض والمنتجات الحصرية. تصفح مجموعتنا الواسعة من المنتجات عالية الجودة.
        </p>
      </div>
    </motion.div>
  );
}
