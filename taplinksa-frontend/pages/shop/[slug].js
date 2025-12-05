import { useState, useEffect } from 'react';
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
import Head from 'next/head';

/**
 * OPTIMIZED Product Page ([slug].js)
 * 
 * Critical Fixes:
 * ✅ Added missing React import (useState)
 * ✅ Added sticky CTA on mobile
 * ✅ Added swipe support for gallery
 * ✅ Added image optimization (priority, quality, placeholder)
 * ✅ Added complete structured data
 * ✅ Added mobile-optimized layout
 * ✅ Added related products section
 * ✅ Added trust badges
 * ✅ Added SEO meta tags
 * ✅ Better price display with urgency signals
 */

export default function ProductPage({ product, relatedProducts }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const { addToCart } = useCart();

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/' },
    { name: 'المتجر', url: '/shop' },
    {
      name: product?.categories?.[0]?.name || 'المنتجات',
      url: product?.categories?.[0]?.slug
        ? `/shop/category/${product.categories[0].slug}`
        : '/shop'
    },
    { name: product?.name || 'المنتج' }
  ];

  // Handle scroll for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const ctaElement = document.getElementById('product-cta');
      if (ctaElement) {
        const rect = ctaElement.getBoundingClientRect();
        setStickyCtaVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle touch swipe for gallery
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && selectedImage < images.length - 1) {
        setSelectedImage(selectedImage + 1);
      }
      if (e.key === 'ArrowRight' && selectedImage > 0) {
        setSelectedImage(selectedImage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  // Loading state
  if (router.isFallback) {
    return (
      <Layout title="جاري التحميل...">
        <div className="container-custom section-padding text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">جاري تحميل المنتج...</p>
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
          <Link href="/shop" className="btn-primary">
            العودة للمتجر
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const salePrice = parseFloat(product.sale_price);
  const hasDiscount = product.on_sale && salePrice > 0 && regularPrice > salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;
  const savings = hasDiscount ? (regularPrice - salePrice).toFixed(2) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const text = `${product.name} - ${price.toFixed(2)} ر.س`;

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('✅ تم نسخ الرابط!');
    } else {
      window.open(links[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const isOutOfStock = product.stock_status !== 'instock';
  const isLowStock = product.stock_quantity && product.stock_quantity <= 5;

  const metaDescription = product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160) || product.name;

  return (
    <>
      <Head>
        {/* SEO Meta Tags */}
        <title>{product.name} | تاب لينك السعودية</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.name}, ${product.categories?.[0]?.name || 'منتجات'}`} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug}`} />
        <meta property="og:image" content={images[0]?.src || '/placeholder.jpg'} />
        <meta property="og:price:amount" content={hasDiscount ? salePrice : price} />
        <meta property="og:price:currency" content="SAR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="product" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={images[0]?.src || '/placeholder.jpg'} />

        {/* Canonical */}
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug}`} />
      </Head>

      <Layout
        title={product.name}
        description={metaDescription}
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
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl font-bold"
                >
                  ✅ تمت إضافة {quantity} من {product.name} للسلة
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gold transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href="/shop" className="text-gray-600 hover:text-gold transition-colors">
                    المتجر
                  </Link>
                </li>
                {product.categories && product.categories[0] && (
                  <>
                    <li className="text-gray-400">/</li>
                    <li>
                      <Link
                        href={`/shop?category=${product.categories[0].id}`}
                        className="text-gray-600 hover:text-gold transition-colors"
                      >
                        {product.categories[0].name}
                      </Link>
                    </li>
                  </>
                )}
                <li className="text-gray-400">/</li>
                <li className="text-gold font-bold truncate max-w-xs">{product.name}</li>
              </ol>
            </nav>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Main Image */}
                <div
                  className="relative bg-white rounded-3xl overflow-hidden shadow-xl aspect-square cursor-grab active:cursor-grabbing"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Discount Badge - PROMINENT */}
                  {hasDiscount && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-6 right-6 z-10"
                    >
                      <div className="px-6 py-3 rounded-full text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                        -{discountPercent}%
                      </div>
                    </motion.div>
                  )}

                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-6 left-6 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all hover:bg-gold hover:text-dark"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <span className="text-2xl">
                      {isWishlisted ? '❤️' : '🤍'}
                    </span>
                  </motion.button>

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
                          alt={`${product.name} - صورة ${selectedImage + 1}`}
                          fill
                          className="object-cover"
                          priority={selectedImage === 0}
                          quality={90}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E"
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex items-center justify-center h-full text-9xl">
                      💳
                    </div>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {selectedImage + 1} / {images.length}
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                        disabled={selectedImage === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center disabled:opacity-50 transition-all"
                      >
                        ←
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                        disabled={selectedImage === images.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center disabled:opacity-50 transition-all"
                      >
                        →
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                          selectedImage === index
                            ? 'ring-4 ring-gold shadow-lg'
                            : 'ring-2 ring-gray-200 hover:ring-gold'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={image.src}
                          alt={`${product.name} thumbnail ${index + 1}`}
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
                id="product-cta"
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
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight">
                  {product.name}
                </h1>

                {/* SKU */}
                {product.sku && (
                  <p className="text-sm text-gray-500">
                    كود المنتج: <span className="font-mono font-bold">{product.sku}</span>
                  </p>
                )}

                {/* Rating & Reviews */}
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

                {/* Price Section - PROMINENT */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-gold/20 to-yellow-100 rounded-2xl p-6 md:p-8 border-2 border-gold/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-end gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl md:text-6xl font-bold text-dark">
                          {(hasDiscount ? salePrice : price).toFixed(2)}
                        </span>
                        <span className="text-2xl md:text-3xl text-gray-600">ر.س</span>
                      </div>
                    </div>

                    {hasDiscount && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-gray-400 line-through">
                            {regularPrice.toFixed(2)} ر.س
                          </span>
                          <span className="text-sm font-bold text-white bg-red-600 px-3 py-1 rounded-full">
                            -{discountPercent}%
                          </span>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          💰 وفّر {savings} ر.س
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100">
                  {product.stock_status === 'instock' ? (
                    <>
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-600 font-bold">متوفر في المخزون</span>
                      {product.stock_quantity && (
                        <span className={`text-sm ${isLowStock ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                          ({product.stock_quantity} قطعة)
                          {isLowStock && ' ⚠️ كمية محدودة'}
                        </span>
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

                {/* Quantity Selector */}
                {product.stock_status === 'instock' && (
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">الكمية:</span>
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-6 py-3 hover:bg-gray-200 transition-all font-bold text-xl"
                      >
                        −
                      </button>
                      <span className="px-6 py-3 font-bold text-xl min-w-[60px] text-center bg-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-6 py-3 hover:bg-gray-200 transition-all font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  {product.stock_status === 'instock' ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyNow}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-gold text-dark hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
                      >
                        🚀 اشتري الآن
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-dark text-gold hover:bg-gray-800 transition-all shadow-lg"
                      >
                        🛒 أضف إلى السلة
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

                {/* Trust Elements */}
                <div className="bg-gradient-to-br from-gold/10 to-yellow-100 rounded-2xl p-6 space-y-4 shadow-lg border-2 border-gold/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚚</span>
                      <div>
                        <p className="font-bold text-dark text-sm md:text-base">شحن مجاني</p>
                        <p className="text-xs text-gray-600">لاكثر من 199 ريال</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⚡</span>
                      <div>
                        <p className="font-bold text-dark text-sm md:text-base">تسليم فوري</p>
                        <p className="text-xs text-gray-600">للمنتجات الرقمية</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🔄</span>
                      <div>
                        <p className="font-bold text-dark text-sm md:text-base">إرجاع مجاني</p>
                        <p className="text-xs text-gray-600">خلال 14 يوم</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🔒</span>
                      <div>
                        <p className="font-bold text-dark text-sm md:text-base">دفع آمن</p>
                        <p className="text-xs text-gray-600">معاملات محمية</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="pt-4 border-t border-gold/30">
                    <p className="text-xs font-bold text-gray-700 mb-2">طرق الدفع المتاحة:</p>
                    <div className="flex gap-2 flex-wrap">
                      {['💳 Visa', '💳 Mastercard', '🏦 تحويل بنكي', '💰 الدفع عند الاستلام'].map((method) => (
                        <span key={method} className="text-xs bg-white px-3 py-1 rounded-full">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Share Product */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm font-bold text-gray-700 mb-3">شارك المنتج:</p>
                  <div className="flex gap-3">
                    {[
                      { name: 'whatsapp', icon: '📱', color: 'bg-green-600 hover:bg-green-700' },
                      { name: 'twitter', icon: '🐦', color: 'bg-blue-400 hover:bg-blue-500' },
                      { name: 'facebook', icon: '📘', color: 'bg-blue-600 hover:bg-blue-700' },
                      { name: 'copy', icon: '📋', color: 'bg-gray-600 hover:bg-gray-700' }
                    ].map((social) => (
                      <motion.button
                        key={social.name}
                        onClick={() => shareProduct(social.name)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-lg ${social.color} text-white flex items-center justify-center text-xl transition-all shadow-lg`}
                        title={social.name}
                      >
                        {social.icon}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sticky CTA on Mobile */}
            <AnimatePresence>
              {stickyCtaVisible && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t-2 border-gold md:hidden"
                >
                  <div className="container-custom py-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className="flex-1 py-3 rounded-lg font-bold text-sm bg-gold text-dark hover:bg-yellow-500 disabled:opacity-50 transition-all"
                    >
                      🚀 اشتري الآن
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 py-3 rounded-lg font-bold text-sm bg-dark text-gold hover:bg-gray-800 disabled:opacity-50 transition-all"
                    >
                      🛒 سلة
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { id: 'description', name: 'الوصف', icon: '📄' },
                  { id: 'specs', name: 'المواصفات', icon: '⚙️' },
                  { id: 'reviews', name: 'التقييمات', icon: '⭐' },
                  { id: 'shipping', name: 'الشحن', icon: '📦' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-max py-4 px-6 font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gold text-dark shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2 text-xl">{tab.icon}</span>
                    {tab.name}
                  </motion.button>
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
                          <p className="text-gray-600">لا توجد مواصفات تقنية متاحة</p>
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
                      className="space-y-4"
                    >
                      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                        <p className="font-bold text-blue-900 mb-2">🚚 الشحن</p>
                        <p className="text-blue-700">شحن مجاني لجميع الطلبات فوق 199 ريال. التسليم خلال 1-3 أيام عمل.</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                        <p className="font-bold text-green-900 mb-2">🔄 الإرجاع</p>
                        <p className="text-green-700">إرجاع مجاني خلال 14 يوم من استلام المنتج بدون أسئلة.</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                        <p className="font-bold text-purple-900 mb-2">⚡ المنتجات الرقمية</p>
                        <p className="text-purple-700">تسليم فوري عبر البريد الإلكتروني بعد تأكيد الدفع مباشرة.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts && relatedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                  منتجات قد تعجبك
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <Link key={relatedProduct.id} href={`/shop/${relatedProduct.slug}`}>
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <Image
                            src={relatedProduct.images?.[0]?.src || '/placeholder.jpg'}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-gold font-bold">
                            {parseFloat(relatedProduct.price).toFixed(2)} ر.س
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

// Keep existing getStaticProps and getStaticPaths
export async function getStaticProps({ params }) {
  try {
    const response = await axios.get(`${process.env.API_URL}/products/${params.slug}`);
    const product = response.data.product;

    // Get related products
    const relatedResponse = await axios.get(
      `${process.env.API_URL}/products?category=${product.categories?.[0]?.id}&exclude=${product.id}&limit=8`
    );
    const relatedProducts = relatedResponse.data.products || [];

    return {
      props: { product, relatedProducts },
      revalidate: 60
    };
  } catch (error) {
    return { notFound: true, revalidate: 60 };
  }
}

export async function getStaticPaths() {
  try {
    const response = await axios.get(`${process.env.API_URL}/products?limit=100`);
    const paths = response.data.products.map((product) => ({
      params: { slug: product.slug }
    }));

    return { paths, fallback: 'blocking' };
  } catch (error) {
    return { paths: [], fallback: 'blocking' };
  }
}
