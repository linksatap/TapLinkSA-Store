import { useState } from 'react';
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
export default function ProductPage({ product, relatedProducts }) {
 

  

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

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

  return (
    <Layout
      title={`${product.name} | تاب لينك السعودية`}
      description={product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160)}
      image={images[0]?.src}
    >
            <ProductSchema product={product} />

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
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl aspect-square">
                {hasDiscount && (
                  <div className="absolute top-6 right-6 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                    >
                      خصم {discountPercent}%
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
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                        selectedImage === index 
                          ? 'ring-4 ring-gold shadow-lg' 
                          : 'ring-2 ring-gray-200 hover:ring-gold'
                      }`}
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
                      {(hasDiscount ? salePrice : price).toFixed(2)}
                    </span>
                    <span className="text-2xl text-gray-600">ر.س</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-400 line-through">
                        {regularPrice.toFixed(2)} ر.س
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        وفّر {(regularPrice - salePrice).toFixed(2)} ر.س
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-4 shadow-lg">
                {product.stock_status === 'instock' ? (
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

              {/* Shipping Info */}
              <div className="bg-gradient-to-br from-gold/10 to-yellow-100 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚚</span>
                  <div>
                    <p className="font-bold text-dark text-lg"> شحن مجاني لاكثر من 199 ريال</p>
                    <p className="text-sm text-gray-600">لجميع مناطق المملكة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <p className="font-bold text-dark text-lg">تسليم فوري للمنتجات الرقمية</p>
                    <p className="text-sm text-gray-600">فوري  </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
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

          {/* Tabs Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              {[
  { id: 'description', name: 'الوصف الكامل', icon: '📄' },
  { id: 'specs', name: 'المواصفات', icon: '⚙️' },
  { id: 'reviews', name: 'التقييمات', icon: '⭐' },
  { id: 'shipping', name: 'الشحن والإرجاع', icon: '📦' }
].map((tab) => (

                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gold text-dark shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
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
                        <li>✓ تسليم مجاني لطلبات المنتجات الرقمية   </li>
                        <li>✓ التوصيل خلال 1-3 أيام للمنتجات المادية</li>
                        <li>✓ التسليم  خلال 1 ساعة  عمل للمنتجات الرقمسة</li>
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

// ✅ SSR - Server-Side Rendering
export async function getServerSideProps({ params }) {
  try {
    // جلب المنتج
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
      },
    };
  } catch (error) {
    console.error('Error in SSR:', error.message);
    return {
      notFound: true,
    };
  }
}
const pageTitle = `${product.name} | تاب لينك السعودية`;
  const pageDescription = product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160) || product.name;
  const pageImage = product.images[0]?.src;

  // إعداد بيانات Breadcrumbs
  const breadcrumbs = [
    { name: 'الرئيسية', url: '/' },
    { name: 'المتجر', url: '/shop' },
    { name: product.name, url: `/shop/${product.slug}` },
  ];

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
      ogImage={pageImage}
      // لا حاجة لتمرير canonical هنا، سيتم حسابه تلقائياً في Layout
    >
      <ProductSchema product={product} />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} /> {/* إضافة Schema للـ Breadcrumbs */}

      {/* ... باقي محتوى الصفحة ... */}
    </Layout>
  );
