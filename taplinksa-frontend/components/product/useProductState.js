// components/product/useProductState.js
import { useState } from 'react';

/**
 * Custom hook to manage product state
 * Handles quantity, image selection, and variant options
 */
export function useProductState(product) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (attributeName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return {
    quantity,
    setQuantity,
    selectedImage,
    setSelectedImage,
    selectedOptions,
    setSelectedOptions,
    handleOptionChange,
    handleQuantityChange,
  };
}
