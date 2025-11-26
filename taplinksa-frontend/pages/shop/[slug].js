import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { getProductBySlug, getProducts } from '../../lib/api';
import ProductReviews from '../../components/ProductReviews';

export default function ProductPage({ product, relatedProducts }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  if (!product) {
    return <div>المنتج غير موجود</div>;
  }

  const images = product.images || [];
  const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const text = `${product.name} - ${product.price} ر.س`;
    
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    } else {
      window.open(links[platform], '_blank');
    }
  };

  return (
    <Layout
      title={`${product.name} | تاب لينك السعودية`}
      description={product.short_description}
    >
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container-custom py-8">
          
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gold">الرئيسية</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-gold">المتجر</Link>
              </li>
              {product.categories && product.categories[0] && (
                <>
                  <li className="text-gray-400">/</li>
                  <li>
                    <Link href={`/shop?category=${product.categories[0].slug}`} className="text-gray-600 hover:text-gold">
                      {product.categories[0].name}
                    </Link>
                  </li>
                </>
              )}
              <li className="text-gray-400">/</li>
              <li className="text-gold font-bold">{product.name}</li>
            </ol>
          </nav>

          {/* المحتوى الرئيسي */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* معرض الصور - على اليسار */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* الصورة الرئيسية */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl aspect-square">
                {hasDiscount && (
                  <div className="absolute top-6 left-6 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                    >
                      وفّر {discountPercent}%
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
                      className={`relative aspect-square rounded-xl overflow-hidden ${
                        selectedImage === index ? 'ring-4 ring-gold' : 'ring-2 ring-gray-200'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* معلومات المنتج - على اليمين */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* الفئات */}
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="text-xs px-3 py-1 bg-gold/10 text-gold rounded-full font-medium hover:bg-gold hover:text-dark transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* العنوان */}
              <h1 className="text-4xl md:text-5xl font-bold text-dark">
                {product.name}
              </h1>

              {/* التقييم */}
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
                  <span className="text-gray-600">
                    ({product.rating_count} تقييم)
                  </span>
                </div>
              )}

              {/* السعر */}
              <div className="flex items-end gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-dark">
                    {parseFloat(product.price).toFixed(0)}
                  </span>
                  <span className="text-2xl text-gray-600">ر.س</span>
                </div>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through mb-1">
                    {parseFloat(product.regular_price).toFixed(0)} ر.س
                  </span>
                )}
              </div>

              {/* حالة المخزون */}
              <div className="flex items-center gap-2">
                {product.stock_status === 'instock' ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-600 font-medium">متوفر في المخزون</span>
                    {product.stock_quantity && (
                      <span className="text-gray-500">({product.stock_quantity} قطعة)</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-medium">نفذت الكمية</span>
                  </>
                )}
              </div>

              {/* الوصف القصير */}
              {product.short_description && (
                <div
                  className="text-lg text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* اختيار الكمية */}
              {product.stock_status === 'instock' && (
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium">الكمية:</span>
                  <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-6 py-3 hover:bg-gray-200 transition-all font-bold text-xl"
                    >
                      −
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
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

              {/* الأزرار */}
              <div className="flex flex-col gap-4">
                {product.stock_status === 'instock' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-gold text-dark hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
                    >
                      🛒 اشتري الآن
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-dark text-gold hover:bg-dark/90 transition-all shadow-lg"
                    >
                      أضف إلى السلة
                    </motion.button>

                    <motion.a
                      href={`https://wa.me/966123456789?text=مرحباً، أريد الاستفسار عن ${product.name}`}
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
                    غير متوفر
                  </button>
                )}
              </div>

              {/* معلومات الشحن */}
              <div className="bg-gradient-to-br from-gold/10 to-yellow-100 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <p className="font-bold text-dark">شحن مجاني</p>
                    <p className="text-sm text-gray-600">لجميع مناطق المملكة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-bold text-dark">تسليم سريع</p>
                    <p className="text-sm text-gray-600">1-3 أيام عمل</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <p className="font-bold text-dark">إرجاع مجاني</p>
                    <p className="text-sm text-gray-600">خلال 14 يوم</p>
                  </div>
                </div>
              </div>

              {/* مشاركة المنتج */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-3">شارك المنتج:</p>
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
                    >
                      {social.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs - المعلومات التفصيلية */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'description', name: 'الوصف', icon: '📄' },
                { id: 'specs', name: 'المواصفات', icon: '⚙️' },
                { id: 'reviews', name: 'التقييمات', icon: '⭐' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gold text-dark'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
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
                          <div key={index} className="bg-gray-50 rounded-xl p-4">
                            <div className="font-bold text-dark mb-2">{attr.name}</div>
                            <div className="text-gray-600">{attr.options.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">لا توجد مواصفات متاحة</p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <p className="text-gray-600">لا توجد تقييمات بعد</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* منتجات مشابهة */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-dark mb-8">منتجات مشابهة</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/product/${related.slug}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                  >
                    <div className="relative aspect-square">
                      {related.images && related.images[0] ? (
                        <Image
                          src={related.images[0].src}
                          alt={related.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">💳</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-dark mb-2 line-clamp-2">{related.name}</h3>
                      <p className="text-gold font-bold text-lg">{parseFloat(related.price).toFixed(0)} ر.س</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
                <ProductReviews productId={product.id} />

      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const { products } = await getProducts(1, 100);
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const product = await getProductBySlug(params.slug);
  
  let relatedProducts = [];
  if (product && product.categories && product.categories[0]) {
    const { products } = await getProducts(1, 4);
    relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);
  }

  return {
    props: {
      product,
      relatedProducts,
    },
    revalidate: 60,
  };
}
