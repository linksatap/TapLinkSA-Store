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


}
