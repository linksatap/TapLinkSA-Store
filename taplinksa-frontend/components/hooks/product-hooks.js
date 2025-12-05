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

// components/product/useProductActions.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';

/**
 * Custom hook for product actions
 * Handles Add to Cart and Buy Now logic
 */
export function useProductActions() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async (product, quantity, selectedOptions) => {
    setLoading(true);
    try {
      await addToCart(product, quantity, selectedOptions);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3500); // 3.5 seconds
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (product, quantity, selectedOptions) => {
    setLoading(true);
    try {
      await addToCart(product, quantity, selectedOptions);
      router.push('/checkout');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return {
    loading,
    addedToCart,
    handleAddToCart,
    handleBuyNow,
  };
}
