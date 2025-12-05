import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * مكون اختيار طريقة الدفع محسّن للموبايل مع إمكانية الوصول
 */
export default function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange 
}) {
  const paymentMethods = [
    {
      id: 'cod',
      title: 'الدفع عند الاستلام',
      description: 'ادفع نقداً عند استلام الطلب',
      icon: '💵',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'ادفع بأمان عبر PayPal',
      icon: '💳',
    },
    {
      id: 'bank',
      title: 'تحويل بنكي',
      description: 'حوّل المبلغ لحسابنا البنكي',
      icon: '🏦',
      extraContent: (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1"
        >
          <div className="font-medium mb-2 text-gray-700">معلومات الحساب البنكي:</div>
          <div className="text-gray-600">
            <strong>اسم الحساب:</strong> مؤسسة تاب لينك
          </div>
          <div className="text-gray-600">
            <strong>IBAN:</strong> SA00 0000 0000 0000 0000 0000
          </div>
          <div className="text-gray-600">
            <strong>البنك:</strong> البنك الأهلي السعودي
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="space-y-3" role="radiogroup" aria-label="طريقة الدفع">
      {paymentMethods.map((method) => {
        const isSelected = selectedMethod === method.id;
        
        return (
          <label
            key={method.id}
            className={`
              flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer 
              transition-all min-h-[68px] md:min-h-[60px]
              ${isSelected 
                ? 'border-gold bg-gold/5 shadow-sm' 
                : 'border-gray-300 hover:border-gold/50 hover:bg-gray-50'
              }
            `}
            htmlFor={`payment-${method.id}`}
          >
            <input
              id={`payment-${method.id}`}
              type="radio"
              name="payment"
              value={method.id}
              checked={isSelected}
              onChange={(e) => onMethodChange(e.target.value)}
              className="w-6 h-6 text-gold flex-shrink-0 mt-0.5 cursor-pointer focus:ring-2 focus:ring-gold focus:ring-offset-2"
              aria-checked={isSelected}
            />
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl" aria-hidden="true">{method.icon}</span>
                <span className="font-bold text-base text-gray-900">{method.title}</span>
              </div>
              <div className="text-sm text-gray-600">{method.description}</div>
              
              <AnimatePresence>
                {isSelected && method.extraContent && (
                  <div className="mt-2">
                    {method.extraContent}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </label>
        );
      })}
    </div>
  );
}
