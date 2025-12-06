import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function ProductsGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-100 rounded-lg aspect-square animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">لا توجد منتجات</h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          جرب تغيير معايير البحث أو الفلاتر للعثور على ما تبحث عنه
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.15) }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
