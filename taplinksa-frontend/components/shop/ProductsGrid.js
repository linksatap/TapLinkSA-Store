import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function ProductsGrid({ products, loading = false }) {
  // Loading State with Skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 md:py-24"
      >
        <div className="text-6xl md:text-8xl mb-6">🔍</div>
        <h3 className="text-xl md:text-2xl font-bold text-dark mb-3">
          لم نجد منتجات مطابقة
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          جرب تغيير الفلاتر أو البحث بكلمات مختلفة
        </p>
        <a href="/shop" className="btn-primary inline-block">
          عرض جميع المنتجات
        </a>
      </motion.div>
    );
  }

  // Products Grid
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
      role="list"
      aria-label="قائمة المنتجات"
    >
      {products.map((product, index) => (
        <div key={product.id} role="listitem">
          <ProductCard 
            product={product}
            priority={index < 4} // Priority loading for first 4 products
            index={index}
          />
        </div>
      ))}
    </div>
  );
}

// Skeleton Loader Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-3 md:p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  );
}
