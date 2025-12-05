import React, { memo } from 'react';
import Image from 'next/image';

/**
 * مكون عنصر السلة محسّن مع React.memo لتجنب إعادة الرسم غير الضرورية
 */
const CartItem = memo(function CartItem({ item }) {
  const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
  
  return (
    <div className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.images?.[0]?.src || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-gray-600">
          الكمية: <span className="font-medium">{item.quantity}</span>
        </p>
      </div>
      
      <div className="font-bold text-gold text-sm whitespace-nowrap flex-shrink-0">
        {itemTotal} ر.س
      </div>
    </div>
  );
});

export default CartItem;
