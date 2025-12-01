/**
 * Analytics Helper Functions
 * دوال مساعدة لتتبع الأحداث في Google Analytics 4
 */

// دالة عامة لإرسال الأحداث إلى GA4
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('⚠️ Google Analytics is not loaded');
  }
};

// تتبع عرض المنتج
export const trackProductView = (product) => {
  trackEvent('view_item', {
    currency: 'SAR',
    value: parseFloat(product.price),
    items: [
      {
        item_id: product.sku || product.id,
        item_name: product.name,
        item_category: product.categories?.[0]?.name || 'غير محدد',
        item_brand: 'TapLink SA',
        price: parseFloat(product.price),
      },
    ],
  });
};

// تتبع إضافة للسلة
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'SAR',
    value: parseFloat(product.price) * quantity,
    items: [
      {
        item_id: product.sku || product.id,
        item_name: product.name,
        item_category: product.categories?.[0]?.name || 'غير محدد',
        item_brand: 'TapLink SA',
        price: parseFloat(product.price),
        quantity: quantity,
      },
    ],
  });
};

// تتبع إزالة من السلة
export const trackRemoveFromCart = (product, quantity = 1) => {
  trackEvent('remove_from_cart', {
    currency: 'SAR',
    value: parseFloat(product.price) * quantity,
    items: [
      {
        item_id: product.sku || product.id,
        item_name: product.name,
        item_category: product.categories?.[0]?.name || 'غير محدد',
        item_brand: 'TapLink SA',
        price: parseFloat(product.price),
        quantity: quantity,
      },
    ],
  });
};

// تتبع عرض السلة
export const trackViewCart = (cart) => {
  const items = cart.map(item => ({
    item_id: item.sku || item.id,
    item_name: item.name,
    item_category: item.categories?.[0]?.name || 'غير محدد',
    item_brand: 'TapLink SA',
    price: parseFloat(item.price),
    quantity: item.quantity || 1,
  }));

  const totalValue = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);

  trackEvent('view_cart', {
    currency: 'SAR',
    value: totalValue,
    items: items,
  });
};

// تتبع بدء عملية الشراء
export const trackBeginCheckout = (cart) => {
  const items = cart.map(item => ({
    item_id: item.sku || item.id,
    item_name: item.name,
    item_category: item.categories?.[0]?.name || 'غير محدد',
    item_brand: 'TapLink SA',
    price: parseFloat(item.price),
    quantity: item.quantity || 1,
  }));

  const totalValue = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);

  trackEvent('begin_checkout', {
    currency: 'SAR',
    value: totalValue,
    items: items,
  });
};

// تتبع إضافة معلومات الشحن
export const trackAddShippingInfo = (cart, shippingMethod) => {
  const items = cart.map(item => ({
    item_id: item.sku || item.id,
    item_name: item.name,
    item_category: item.categories?.[0]?.name || 'غير محدد',
    item_brand: 'TapLink SA',
    price: parseFloat(item.price),
    quantity: item.quantity || 1,
  }));

  const totalValue = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);

  trackEvent('add_shipping_info', {
    currency: 'SAR',
    value: totalValue,
    shipping_tier: shippingMethod,
    items: items,
  });
};

// تتبع إضافة معلومات الدفع
export const trackAddPaymentInfo = (cart, paymentMethod) => {
  const items = cart.map(item => ({
    item_id: item.sku || item.id,
    item_name: item.name,
    item_category: item.categories?.[0]?.name || 'غير محدد',
    item_brand: 'TapLink SA',
    price: parseFloat(item.price),
    quantity: item.quantity || 1,
  }));

  const totalValue = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);

  trackEvent('add_payment_info', {
    currency: 'SAR',
    value: totalValue,
    payment_type: paymentMethod,
    items: items,
  });
};

// تتبع إتمام عملية الشراء
export const trackPurchase = (order) => {
  const items = order.line_items.map(item => ({
    item_id: item.sku || item.product_id,
    item_name: item.name,
    item_category: item.category || 'غير محدد',
    item_brand: 'TapLink SA',
    price: parseFloat(item.price),
    quantity: item.quantity,
  }));

  trackEvent('purchase', {
    transaction_id: order.id,
    value: parseFloat(order.total),
    currency: 'SAR',
    tax: parseFloat(order.total_tax || 0),
    shipping: parseFloat(order.shipping_total || 0),
    items: items,
  });
};

// تتبع البحث
export const trackSearch = (searchTerm, resultsCount = 0) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// تتبع النقر على رابط خارجي
export const trackOutboundLink = (url, label) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    transport_type: 'beacon',
    event_callback: function() {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
  });
};

// تتبع مشاركة المحتوى
export const trackShare = (method, contentType, contentId) => {
  trackEvent('share', {
    method: method, // 'whatsapp', 'twitter', 'facebook', 'copy'
    content_type: contentType, // 'product', 'article', 'page'
    content_id: contentId,
  });
};

// تتبع الاشتراك في النشرة البريدية
export const trackNewsletterSignup = (location) => {
  trackEvent('sign_up', {
    method: 'newsletter',
    location: location, // 'footer', 'popup', 'blog'
  });
};

// تتبع النقر على WhatsApp
export const trackWhatsAppClick = (location) => {
  trackEvent('contact', {
    method: 'whatsapp',
    location: location, // 'float', 'footer', 'product', 'contact'
  });
};

// تتبع عرض الفيديو
export const trackVideoView = (videoTitle, videoUrl) => {
  trackEvent('video_start', {
    video_title: videoTitle,
    video_url: videoUrl,
  });
};

// تتبع التفاعل مع الصور
export const trackImageInteraction = (imageName, action) => {
  trackEvent('image_interaction', {
    image_name: imageName,
    action: action, // 'zoom', 'gallery_view', 'download'
  });
};

// تتبع استخدام الكوبون
export const trackCouponUsage = (couponCode, discount) => {
  trackEvent('coupon_applied', {
    coupon_code: couponCode,
    discount_amount: discount,
    currency: 'SAR',
  });
};

// تتبع عرض الصفحة (يدوي)
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// تتبع الأخطاء
export const trackError = (errorMessage, errorLevel = 'error') => {
  trackEvent('exception', {
    description: errorMessage,
    fatal: errorLevel === 'fatal',
  });
};

// تتبع وقت التفاعل
export const trackTiming = (category, variable, value, label) => {
  trackEvent('timing_complete', {
    name: variable,
    value: value, // بالميلي ثانية
    event_category: category,
    event_label: label,
  });
};
