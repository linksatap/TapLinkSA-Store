// components/product/ProductVariants.js
export default function ProductVariants({
  attributes = [],
  selectedOptions,
  isOutOfStock,
  onOptionChange,
}) {
  const variationAttributes = attributes.filter((attr) => attr.variation);

  if (!variationAttributes.length) return null;

  return (
    <div className="space-y-4 bg-gray-50 rounded-lg p-4 md:p-5">
      {variationAttributes.map((attribute, idx) => (
        <div key={idx}>
          <label className="block text-xs md:text-sm font-bold text-dark mb-3">
            {attribute.name}
            {selectedOptions[attribute.name] && (
              <span className="mr-2 text-gold text-xs md:text-sm font-medium">
                ✓ {selectedOptions[attribute.name]}
              </span>
            )}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {attribute.options.map((option, optIdx) => (
              <button
                key={optIdx}
                onClick={() => onOptionChange(attribute.name, option)}
                disabled={isOutOfStock}
                className={`px-3 py-2 md:py-3 rounded-lg font-medium text-xs md:text-sm transition-all border-2 active:scale-95 ${
                  selectedOptions[attribute.name] === option
                    ? 'bg-gold text-white border-gold shadow-lg'
                    : 'bg-white text-dark border-gray-300 hover:border-gold hover:bg-gold/5'
                } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={`اختر ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
