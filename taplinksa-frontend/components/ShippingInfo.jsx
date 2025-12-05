import React from 'react';

/**
 * مكون عرض معلومات الشحن مع حالات مختلفة
 */
export default function ShippingInfo({ 
  shippingInfo, 
  calculating, 
  error, 
  onRetry 
}) {
  // حالة: جاري الحساب
  if (calculating) {
    return (
      <div className="flex justify-between items-center text-gray-600">
        <span>الشحن</span>
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm text-blue-600">جاري الحساب...</span>
        </div>
      </div>
    );
  }

  // حالة: خطأ في الحساب
  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start text-gray-600">
          <span>الشحن</span>
          <div className="text-left">
            <p className="text-sm text-red-600 mb-1">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // حالة: تم حساب الشحن
  if (shippingInfo) {
    const isFree = shippingInfo.cost === 0;
    
    return (
      <div className="flex justify-between items-center text-gray-600">
        <span>الشحن</span>
        {isFree ? (
          <div className="text-left">
            <span className="font-bold text-green-600 text-base">مجاني 🎉</span>
            {shippingInfo.method && (
              <p className="text-xs text-gray-500">{shippingInfo.method}</p>
            )}
          </div>
        ) : (
          <div className="text-left">
            <span className="font-bold text-gray-900">
              {shippingInfo.cost.toFixed(2)} ر.س
            </span>
            {shippingInfo.method && (
              <p className="text-xs text-gray-500">{shippingInfo.method}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // حالة: في انتظار إدخال الرمز البريدي
  return (
    <div className="flex justify-between items-start text-gray-600">
      <span>الشحن</span>
      <div className="text-left">
        <span className="text-sm text-amber-600 block font-medium">
          أدخل الرمز البريدي
        </span>
        <span className="text-xs text-gray-500">لحساب تكلفة الشحن</span>
      </div>
    </div>
  );
}
