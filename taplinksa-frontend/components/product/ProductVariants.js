// components/product/ProductVariants.js - Updated
import { useState, useEffect } from 'react';

export default function ProductVariants({ 
  attributes = [], 
  selectedOptions, 
  isOutOfStock, 
  onOptionChange,
  onPriceChange 
}) {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  const handleVariantChange = (attributeName, value) => {
    onOptionChange(attributeName, value);
    
    // إذا كان هناك تعديل السعر المرتبط بالخيار
    if (onPriceChange) {
      onPriceChange(value);
    }
  };

  return (
    <div className="space-y-6 py-6 border-y border-gray-200">
      <h3 className="text-lg font-bold text-dark">الخيارات المتاحة</h3>

      {attributes.map((attribute) => {
        // تخطي الخيارات التي لا تؤثر على السعر أو الأداء
        if (attribute.variation === false) {
          return null;
        }

        const attributeName = attribute.name;
        const options = attribute.options || [];
        const selectedValue = selectedOptions[attributeName];

        return (
          <div key={attributeName} className="space-y-3">
            <label className="block font-semibold text-dark">
              {attributeName}
              {selectedValue && (
                <span className="text-gold mr-2">← {selectedValue}</span>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isSelected = selectedValue === option;
                const isDisabled = isOutOfStock;

                return (
                  <button
                    key={option}
                    onClick={() => !isDisabled && handleVariantChange(attributeName, option)}
                    disabled={isDisabled}
                    className={`
                      px-4 py-2 rounded-lg border-2 transition-all font-medium
                      ${isSelected
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gray-300 bg-white text-dark hover:border-gold'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
