import ProductCard from './ProductCard';

export default function ProductsGrid({ products, loading = false }) {
  
  // Loading State with Skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 md:py-24 px-4">
        <div className="text-6xl md:text-8xl mb-6">🔍</div>
        <h3 className="text-xl md:text-2xl font-bold text-dark mb-3">
          لم نجد منتجات متاحة
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-6 max-w-md mx-auto">
          جرب تغيير الفلاتر أو البحث بكلمات مختلفة، أو تصفح الأقسام الأخرى
        </p>
        <a 
          href="/shop" 
          className="inline-block bg-gold text-white font-bold py-3 px-6 rounded-lg hover:bg-gold-dark transition-colors"
        >
          عرض جميع المنتجات
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Skeleton Loader Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-3 md:p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded-full w-20"></div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
