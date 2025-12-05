import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function ProductsGrid({ products, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 md:py-24"
      >
        <div className="text-6xl md:text-8xl mb-6">🔍</div>
        <h3 className="text-xl md:text-2xl font-bold mb-3">لا توجد منتجات متاحة حالياً</h3>
        <p className="text-gray-600 mb-6">جرب البحث بكلمات مختلفة أو تصفح الأقسام الأخرى</p>
        <a href="/shop" className="btn-primary inline-block">
          عرض جميع المنتجات
        </a>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product}
          priority={index < 4} // Priority loading for first 4
        />
      ))}
    </div>
  );
}

// Skeleton Loader Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 md:p-4">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
