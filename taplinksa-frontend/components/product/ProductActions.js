// components/product/ProductActions.js
export default function ProductActions({
  isOutOfStock,
  loading,
  addedToCart,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      {/* Buy Now Button */}
      <button
        onClick={onBuyNow}
        disabled={isOutOfStock || loading}
        className="bg-gradient-to-b from-gold to-gold-dark text-white font-bold py-3 md:py-4 px-6 rounded-lg md:rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base md:text-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-gold/50"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm md:text-base">جاري المعالجة...</span>
          </>
        ) : (
          <>
            <span className="text-lg">🚀</span>
            <span>اشتري الآن</span>
          </>
        )}
      </button>

      {/* Add to Cart Button */}
      <button
        onClick={onAddToCart}
        disabled={isOutOfStock || loading}
        className="bg-white border-2 border-gold text-gold font-bold py-3 md:py-4 px-6 rounded-lg md:rounded-xl hover:bg-gold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base md:text-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-gold/50"
      >
        {addedToCart ? (
          <>
            <span className="text-lg">✓</span>
            <span>تمت الإضافة</span>
          </>
        ) : (
          <>
            <span className="text-lg">🛒</span>
            <span>أضف للسلة</span>
          </>
        )}
      </button>
    </div>
  );
}
