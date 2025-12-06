import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function ProductsGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {Array(12)
          .fill(null)
          .map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"
              style={{ aspectRatio: '1' }}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                  <div className="h-8 bg-gray-300 rounded w-1/3 mt-4" />
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4"
      >
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">لا توجد منتجات</h3>
        <p className="text-gray-600">
          عذراً، لم نتمكن من العثور على منتجات تطابق معايير البحث الخاصة بك.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.5,
            delay: Math.min(index * 0.05, 0.2), // Cap delay at 200ms
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
