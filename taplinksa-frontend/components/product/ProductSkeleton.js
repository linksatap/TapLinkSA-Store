// components/product/ProductSkeleton.js
export default function ProductSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">جاري تحميل المنتج...</p>
      </div>
    </div>
  );
}
