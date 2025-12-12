// components/product/ProductPrice.js
export default function ProductPrice({
  price,
  regularPrice,
  isOnSale,
  discountPercentage,
  isOutOfStock,
}) {
  return (
    <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl p-5 md:p-6 border-2 border-gold/30 shadow-sm">
      {/* Price Row */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gold">
            {price.toFixed(2)}
          </span>
          <span className="text-sm md:text-base font-semibold text-gold">⃁</span>
        </div>
        {isOnSale && (
          <span className="text-base md:text-lg text-gray-400 line-through">
            {regularPrice.toFixed(2)}⃁
          </span>
        )}
      </div>

      {/* Discount & Savings */}
      {isOnSale && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded px-3 py-2 mb-4">
          <p className="text-sm md:text-base text-green-700 font-semibold">
            💰 وفّر <span className="font-bold text-lg">{(regularPrice - price).toFixed(2)}</span>⃁ (
            <span className="font-bold">{discountPercentage}%</span> خصم)
          </p>
        </div>
      )}

      {/* Stock Status */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs md:text-sm ${
          isOutOfStock
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'
          }`}
        ></span>
        {isOutOfStock ? 'غير متوفر حالياً' : 'متوفر في المخزون'}
      </div>
    </div>
  );
}
