// components/product/ProductQuantity.js
export default function ProductQuantity({
  quantity,
  onQuantityChange,
  isOutOfStock,
}) {
  return (
    <div>
      <label className="block text-xs md:text-sm font-bold text-dark mb-3">الكمية:</label>
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 w-fit">
        <button
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-gray-300 rounded-lg font-bold text-lg md:text-xl hover:border-gold hover:text-gold hover:bg-gold/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          title="تقليل"
          aria-label="تقليل الكمية"
        >
          −
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          className="w-16 md:w-20 h-10 md:h-12 text-center text-lg md:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none"
          min="1"
          max="999"
          aria-label="الكمية"
        />
        <button
          onClick={() => onQuantityChange(1)}
          className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-gray-300 rounded-lg font-bold text-lg md:text-xl hover:border-gold hover:text-gold hover:bg-gold/5 transition-colors active:scale-95"
          title="زيادة"
          aria-label="زيادة الكمية"
        >
          +
        </button>
      </div>
    </div>
  );
}
