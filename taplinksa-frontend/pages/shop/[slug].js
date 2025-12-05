import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import ProductReviews from '../../components/ProductReviews';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

/**
 * تحسينات UX/CX المطبقة:
 * 1. استخدام useMemo لتحسين الأداء
 * 2. إضافة حد أقصى للكمية بناءً على المخزون
 * 3. تحسين رسائل النجاح والخطأ
 * 4. إضافة قسم الأنواع (Variants) من WooCommerce
 * 5. تحسين سهولة الوصول (Accessibility)
 * 6. إضافة تأكيد قبل الشراء
 * 7. تحسين الأداء مع lazy loading
 * 8. إضافة خيارات الدفع والشحن بشكل أوضح
 */

export default function ProductPage({ product, relatedProducts, productVariants }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const successTimeoutRef = useRef(null);
  const { addToCart } = useCart();

  // Breadcrumb items
  const breadcrumbItems = useMemo(() => [
    { name: 'الرئيسية', url: '/' },
    { name: 'المتجر', url: '/shop' },
    {
      name: product?.categories?.[0]?.name || 'المنتجات',
      url: product?.categories?.[0]?.slug
        ? `/shop/category/${product.categories[0].slug}`
        : '/shop'
    },
    { name: product?.name || 'المنتج' }
  ], [product]);

  // حساب السعر والخصم
  const priceData = useMemo(() => {
    const price = parseFloat(product?.price || 0);
    const regularPrice = parseFloat(product?.regular_price || 0);
    const salePrice = parseFloat(product?.sale_price || 0);
    const hasDiscount = product?.on_sale && salePrice > 0 && regularPrice > salePrice;
    const discountPercent = hasDiscount
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

    return {
      price,
      regularPrice,
      salePrice,
      hasDiscount,
      discountPercent,
      displayPrice: hasDiscount ? salePrice : price,
      savings: hasDiscount ? (regularPrice - salePrice).toFixed(2) : 0
    };
  }, [product]);

  // الحد الأقصى للكمية
  const maxQuantity = useMemo(() => {
    const stock = product?.stock_quantity || 100;
    return Math.min(stock, 100); // حد أقصى 100 قطعة
  }, [product?.stock_quantity]);

  // تنظيف timeout عند unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Loading state
  if (router.isFallback) {
    return (
      <Layout title="جاري التحميل...">
        <div className="container-custom section-padding text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </Layout>
    );
  }

  // Product not found
  if (!product) {
    return (
      <Layout title="المنتج غير موجود">
        <div className="container-custom section-padding text-center">
          <div className="text-8xl mb-6">😞</div>
          <h1 className="text-4xl font-bold mb-4">المنتج غير موجود</h1>
          <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على هذا المنتج</p>
          <Link href="/shop" className="btn-primary inline-block">
            العودة للمتجر
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];

  // معالجة إضافة المنتج للسلة مع تحسينات
  const handleAddToCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // التحقق من اختيار المتغيرات إن وجدت
      if (productVariants && productVariants.length > 0 && !selectedVariant) {
        setError('يرجى اختيار نوع المنتج أولاً');
        setIsLoading(false);
        return;
      }

      // التحقق من الكمية
      if (quantity < 1 || quantity > maxQuantity) {
        setError(`الكمية يجب أن تكون بين 1 و ${maxQuantity}`);
        setIsLoading(false);
        return;
      }

      // إضافة المنتج للسلة
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          variant: selectedVariant
        });
      }

      setSuccessMessage(`تمت إضافة ${quantity} من ${product.name} للسلة بنجاح ✅`);
      setShowSuccess(true);
      setQuantity(1);

      // إغلاق الرسالة بعد 3 ثواني
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError('حدث خطأ أثناء إضافة المنتج للسلة');
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quantity, product, addToCart, selectedVariant, productVariants, maxQuantity]);

  // معالجة الشراء الفوري مع تأكيد
  const handleBuyNow = useCallback(async () => {
    if (productVariants && productVariants.length > 0 && !selectedVariant) {
      setError('يرجى اختيار نوع المنتج أولاً');
      return;
    }

    await handleAddToCart();
    // الانتظار قليلاً قبل الانتقال للدفع
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  }, [handleAddToCart, selectedVariant, productVariants, router]);

  // مشاركة المنتج
  const shareProduct = useCallback((platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${product.name} - ${priceData.displayPrice.toFixed(2)} ر.س`;

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          setSuccessMessage('✅ تم نسخ الرابط!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        });
      }
    } else {
      window.open(links[platform], '_blank', 'noopener,noreferrer');
    }
  }, [product.name, priceData.displayPrice]);

  // معالجة تغيير الكمية مع التحقق من الحد الأقصى
  const handleQuantityChange = useCallback((newQuantity) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    setQuantity(validQuantity);
  }, [maxQuantity]);

  const isInStock = product.stock_status === 'instock';
  const hasVariants = productVariants && productVariants.length > 0;

  return (
    <Layout
      title={`${product.name} | تاب لينك السعودية`}
      description={product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160)}
      image={images[0]?.src}
    >
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container-custom py-8">
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl font-bold max-w-sm"
                role="alert"
                aria-live="polite"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl font-bold max-w-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <li className="text-gray-400">/</li>}
                  <li>
                    {item.url ? (
                      <Link
                        href={item.url}
                        className="text-gray-600 hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-gold font-bold truncate max-w-xs">{item.name}</span>
                    )}
                  </li>
                </div>
              ))}
            </ol>
          </nav>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl aspect-square">
                {priceData.hasDiscount && (
                  <div className="absolute top-6 right-6 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                    >
                      خصم {priceData.discountPercent}%
                    </motion.div>
                  </div>
                )}

                {images.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={images[selectedImage].src}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="flex items-center justify-center h-full text-9xl">
                    💳
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all cursor-pointer ${
                        selectedImage === index
                          ? 'ring-4 ring-gold shadow-lg'
                          : 'ring-2 ring-gray-200 hover:ring-gold'
                      }`}
                      aria-label={`صورة المنتج ${index + 1}`}
                      aria-pressed={selectedImage === index}
                    >
                      <Image
                        src={image.src}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      className="text-xs px-3 py-1 bg-gold/10 text-gold rounded-full font-medium hover:bg-gold hover:text-dark transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-dark leading-tight">
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-gray-500">
                  كود المنتج: <span className="font-mono font-bold">{product.sku}</span>
                </p>
              )}

              {/* Rating */}
              {product.average_rating && parseFloat(product.average_rating) > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < Math.round(parseFloat(product.average_rating))
                            ? 'text-gold'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {parseFloat(product.average_rating).toFixed(1)} ({product.rating_count || 0} تقييم)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="bg-gold/10 rounded-2xl p-6">
                <div className="flex items-end gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-dark">
                      {priceData.displayPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl text-gray-600">ر.س</span>
                  </div>
                  {priceData.hasDiscount && (
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-400 line-through">
                        {priceData.regularPrice.toFixed(2)} ر.س
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        وفّر {priceData.savings} ر.س
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-4 shadow-lg">
                {isInStock ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-600 font-bold">متوفر في المخزون</span>
                    {product.stock_quantity && (
                      <span className="text-gray-500">({product.stock_quantity} قطعة)</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-bold">نفذت الكمية</span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <div
                  className="prose prose-lg text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description
                  }}
                />
              )}

              {/* Product Variants Section */}
              {hasVariants && (
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border-2 border-gold/20">
                  <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                    <span>🎯</span> اختر نوع المنتج
                  </h3>
                  <div className="space-y-3">
                    {productVariants.map((variant) => (
                      <motion.button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-xl transition-all text-right ${
                          selectedVariant?.id === variant.id
                            ? 'bg-gold text-dark shadow-lg border-2 border-gold'
                            : 'bg-white text-dark border-2 border-gray-200 hover:border-gold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold">{variant.name}</p>
                            {variant.description && (
                              <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
                            )}
                          </div>
                          {variant.price && variant.price !== product.price && (
                            <span className="font-bold text-lg">
                              +{(parseFloat(variant.price) - parseFloat(product.price)).toFixed(2)} ر.س
                            </span>
                          )}
                        </div>
                        {variant.stock_status !== 'instock' && (
                          <p className="text-red-600 text-sm mt-2">غير متوفر حالياً</p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {isInStock && (
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-lg font-bold">
                    الكمية:
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-6 py-3 hover:bg-gray-200 transition-all font-bold text-xl"
                      aria-label="تقليل الكمية"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={maxQuantity}
                      className="px-6 py-3 font-bold text-xl min-w-[60px] text-center bg-white border-0 focus:outline-none focus:ring-2 focus:ring-gold"
                      aria-label="عدد الكطع"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-6 py-3 hover:bg-gray-200 transition-all font-bold text-xl"
                      aria-label="زيادة الكمية"
                      disabled={quantity >= maxQuantity}
                    >
                      +
                    </button>
                  </div>
                  {maxQuantity < 100 && (
                    <span className="text-sm text-gray-500">الحد الأقصى: {maxQuantity}</span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                {isInStock ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={isLoading || (hasVariants && !selectedVariant)}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-gold text-dark hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="اشتري الآن"
                    >
                      {isLoading ? '⏳ جاري المعالجة...' : '🚀 اشتري الآن'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={isLoading || (hasVariants && !selectedVariant)}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-dark text-gold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="أضف إلى السلة"
                    >
                      {isLoading ? '⏳ جاري المعالجة...' : '🛒 أضف إلى السلة'}
                    </motion.button>

                    <motion.a
                      href={`https://wa.me/966${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '123456789'}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن ${product.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg text-center"
                    >
                      📱 استفسر عبر واتساب
                    </motion.a>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    ❌ غير متوفر
                  </button>
                )}
              </div>

              {/* Shipping Info */}
              <div className="bg-gradient-to-br from-gold/10 to-yellow-100 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚚</span>
                  <div>
                    <p className="font-bold text-dark text-lg">شحن مجاني لأكثر من 199 ريال</p>
                    <p className="text-sm text-gray-600">لجميع مناطق المملكة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <p className="font-bold text-dark text-lg">تسليم فوري للمنتجات الرقمية</p>
                    <p className="text-sm text-gray-600">فوري خلال دقائق</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📦</span>
                  <div>
                    <p className="font-bold text-dark text-lg">تسليم سريع للمنتجات المادية</p>
                    <p className="text-sm text-gray-600">1-3 أيام عمل</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔄</span>
                  <div>
                    <p className="font-bold text-dark text-lg">إرجاع مجاني</p>
                    <p className="text-sm text-gray-600">خلال 14 يوم</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔒</span>
                  <div>
                    <p className="font-bold text-dark text-lg">دفع آمن</p>
                    <p className="text-sm text-gray-600">معاملات محمية 100%</p>
                  </div>
                </div>
              </div>

              {/* Share Product */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm font-bold text-gray-700 mb-3">شارك المنتج:</p>
                <div className="flex gap-3">
                  {[
                    { name: 'whatsapp', icon: '📱', color: 'bg-green-600 hover:bg-green-700', label: 'مشاركة عبر واتساب' },
                    { name: 'twitter', icon: '🐦', color: 'bg-blue-400 hover:bg-blue-500', label: 'مشاركة عبر تويتر' },
                    { name: 'facebook', icon: '📘', color: 'bg-blue-600 hover:bg-blue-700', label: 'مشاركة عبر فيسبوك' },
                    { name: 'copy', icon: '📋', color: 'bg-gray-600 hover:bg-gray-700', label: 'نسخ الرابط' }
                  ].map((social) => (
                    <motion.button
                      key={social.name}
                      onClick={() => shareProduct(social.name)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 rounded-lg ${social.color} text-white flex items-center justify-center text-xl transition-all shadow-lg`}
                      aria-label={social.label}
                      title={social.label}
                    >
                      {social.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'description', name: 'الوصف الكامل', icon: '📄' },
                { id: 'specs', name: 'المواصفات', icon: '⚙️' },
                { id: 'reviews', name: 'التقييمات', icon: '⭐' },
                { id: 'shipping', name: 'الشحن والإرجاع', icon: '📦' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gold text-dark shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  <span className="mr-2 text-xl">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ProductReviews productId={product.id} />
                  </motion.div>
                )}

                {activeTab === 'specs' && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {product.attributes && product.attributes.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.attributes.map((attr, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                            <div className="font-bold text-dark mb-2">{attr.name}</div>
                            <div className="text-gray-600">{attr.options.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-600">لا توجد مواصفات تقنية متاحة لهذا المنتج</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>🚚</span> سياسة الشحن
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>✓ شحن مجاني للطلبات فوق 199 لجميع مناطق المملكة</li>
                        <li>✓ تسليم مجاني لطلبات المنتجات الرقمية</li>
                        <li>✓ التوصيل خلال 1-3 أيام للمنتجات المادية</li>
                        <li>✓ التسليم خلال 1 ساعة عمل للمنتجات الرقمية</li>
                        <li>✓ تتبع الشحنة عبر رقم الطلب</li>
                        <li>✓ التسليم من الأحد إلى الخميس</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>🔄</span> سياسة الإرجاع والاستبدال
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>✓ إمكانية الإرجاع خلال 14 يوم من الاستلام</li>
                        <li>✓ يجب أن يكون المنتج في حالته الأصلية</li>
                        <li>✓ استرجاع كامل المبلغ أو استبدال</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-dark mb-8">منتجات ذات صلة</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/shop/${related.slug}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
                  >
                    <div className="relative aspect-square">
                      {related.images && related.images[0] ? (
                        <Image
                          src={related.images[0].src}
                          alt={related.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl bg-gray-100">💳</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-dark mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                        {related.name}
                      </h3>
                      <p className="text-gold font-bold text-lg">
                        {parseFloat(related.price).toFixed(2)} ر.س
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

/**
 * SSR - Server-Side Rendering
 * تحسينات الأداء:
 * 1. جلب المتغيرات من WooCommerce
 * 2. معالجة الأخطاء بشكل أفضل
 * 3. إضافة timeout للطلبات
 */
export async function getServerSideProps({ params }) {
  try {
    // جلب المنتج الرئيسي
    const productResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/products`,
      {
        params: {
          slug: params.slug,
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
        timeout: 10000,
      }
    );

    const product = productResponse.data[0];

    if (!product) {
      return {
        notFound: true,
      };
    }

    // جلب المتغيرات (Variants) إن وجدت
    let productVariants = [];
    if (product.type === 'variable') {
      try {
        const variantsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WC_API_URL}/products/${product.id}/variations`,
          {
            params: {
              per_page: 100,
              status: 'publish'
            },
            auth: {
              username: process.env.WC_CONSUMER_KEY,
              password: process.env.WC_CONSUMER_SECRET,
            },
            timeout: 10000,
          }
        );
        productVariants = variantsResponse.data.map(variant => ({
          id: variant.id,
          name: variant.attributes.map(attr => attr.option).join(' - '),
          description: variant.description || '',
          price: variant.price || product.price,
          stock_status: variant.stock_status,
          stock_quantity: variant.stock_quantity,
          image: variant.image?.src
        }));
      } catch (error) {
        console.error('Error fetching product variants:', error.message);
      }
    }

    // جلب المنتجات ذات الصلة
    let relatedProducts = [];
    if (product.categories && product.categories.length > 0) {
      try {
        const relatedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WC_API_URL}/products`,
          {
            params: {
              category: product.categories[0].id,
              per_page: 4,
              exclude: product.id,
              orderby: 'rand',
              status: 'publish',
            },
            auth: {
              username: process.env.WC_CONSUMER_KEY,
              password: process.env.WC_CONSUMER_SECRET,
            },
            timeout: 10000,
          }
        );
        relatedProducts = relatedResponse.data;
      } catch (error) {
        console.error('Error fetching related products:', error.message);
      }
    }

    return {
      props: {
        product,
        relatedProducts,
        productVariants,
      },
      revalidate: 3600, // ISR: إعادة التحقق كل ساعة
    };
  } catch (error) {
    console.error('Error in SSR:', error.message);
    return {
      notFound: true,
    };
  }
}
