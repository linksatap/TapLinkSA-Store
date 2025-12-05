import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook لحساب تكلفة الشحن مع debouncing
 */
export function useShippingCalculator(postcode, cart, subtotal) {
  const [shippingInfo, setShippingInfo] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * حساب تكلفة الشحن
   */
  const calculateShipping = useCallback(async () => {
    if (!postcode || !cart || cart.length === 0) {
      setShippingInfo(null);
      setError(null);
      return;
    }

    // إلغاء أي طلب سابق
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setCalculating(true);
    setError(null);

    try {
      const items = cart.map(item => ({
        id: item.id,
        virtual: item.virtual,
        downloadable: item.downloadable,
        quantity: item.quantity
      }));

      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postcode,
          items,
          subtotal 
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setShippingInfo(data.shipping);
        setError(null);
      } else {
        setShippingInfo(null);
        setError(data.message || 'لم نتمكن من حساب تكلفة الشحن');
      }
    } catch (err) {
      // تجاهل أخطاء الإلغاء
      if (err.name === 'AbortError') {
        return;
      }
      
      console.error('Error calculating shipping:', err);
      setShippingInfo(null);
      setError('حدث خطأ في حساب الشحن. يرجى المحاولة مرة أخرى.');
    } finally {
      setCalculating(false);
    }
  }, [postcode, cart, subtotal]);

  /**
   * Effect مع debouncing لحساب الشحن
   */
  useEffect(() => {
    // إعادة تعيين الحالة إذا لم يكن هناك رمز بريدي
    if (!postcode || !cart || cart.length === 0) {
      setShippingInfo(null);
      setError(null);
      setCalculating(false);
      return;
    }

    // Debounce: انتظار 500ms بعد آخر تغيير
    const timer = setTimeout(() => {
      calculateShipping();
    }, 500);

    return () => {
      clearTimeout(timer);
      // إلغاء أي طلب جاري
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [postcode, cart?.length, subtotal, calculateShipping]);

  /**
   * إعادة المحاولة يدوياً
   */
  const retry = useCallback(() => {
    calculateShipping();
  }, [calculateShipping]);

  /**
   * حساب تكلفة الشحن
   */
  const shippingCost = shippingInfo ? shippingInfo.cost : 0;

  /**
   * التحقق من أن الشحن مجاني
   */
  const isFreeShipping = shippingInfo && shippingInfo.cost === 0;

  return {
    shippingInfo,
    shippingCost,
    calculating,
    error,
    isFreeShipping,
    retry,
  };
}
