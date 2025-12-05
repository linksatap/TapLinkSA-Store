import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductPage({ product: initialProduct, relatedProducts }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // If page is loading
  if (router.isFallback || !product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">جاري تحميل المنتج...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If product not found
  if (!product || product.error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-6">😔</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">عذراً، لم نتمكن من العثور على هذا المنتج</h1>
            <button 
              onClick={() => router.push('/shop')}
              className="btn-primary"
            >
              العودة للمتجر
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const discountPercentage = regularPrice > price 
    ? Math.round(((regularPrice - price) / regularPrice) * 100) 
    : 0;
  const isOnSale = product.on_sale && discountPercentage > 0;
  const isOutOfStock = product.stock_status !== 'instock';

  // Handle variant selection
  const handleOptionChange = (attributeName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  // Handle quantity
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product, quantity, selectedOptions);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Buy Now
  const handleBuyNow = async () => {
    setLoading(true);
    try {
      await addToCart(product, quantity, selectedOptions);
      router.push('/checkout');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <Layout title={`${product.name} | تاب لينك السعودية`}>
      <Head>
        <title>{product.name} | تاب لينك السعودية</title>
        <meta name="description" content={product.short_description?.replace(/<[^>]*>/g, '') || product.name} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description?.replace(/<[^>]*>/g, '')} />
        <meta property="og:image" content={images[0]?.src} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={price} />
        <meta property="product:price:currency" content="SAR" />
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": images.map(img => img.src),
            "description": product.short_description?.replace(/<[^>]*>/g, ''),
            "sku": product.sku,
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": "SAR",
              "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              "url": `https://taplinksa.com/products/${product.slug}`
            },
            ...(product.average_rating && {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.average_rating,
                "reviewCount": product.rating_count || 0
              }
            })
          })}
        </script>
      </Head>

      <div className="bg-gradient-to-br from-gold/5 via-white to-gray-50 min-h-screen py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" data-aos="fade-right">
            <ol className="flex items-center gap-2 text-gray-600">
              <li><a href="/" className="hover:text-gold transition-colors">الرئيسية</a></li>
              <li>/</li>
              <li><a href="/shop" className="hover:text-gold transition-colors">المتجر</a></li>
              <li>/</li>
              <li className="text-gold font-medium truncate">{product.name}</li>
            </ol>
          </nav>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* LEFT: Image Gallery */}
            <div className="space-y-4" data-aos="fade-right">
              {/* Main Image with Aspect Ratio */}
              <div className="relative aspect-square bg-white rounded-2xl shadow-xl overflow-hidden group">
                {images.length > 0 && (
                  <Image
                    src={images[selectedImage]?.src || images[0]?.src}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 md:p-8 group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                )}
                
                {/* Sale Badge */}
                {isOnSale && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-10">
                    وفر {discountPercentage}%
                  </div>
                )}

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                      aria-label="الصورة السابقة"
                    >
                      →
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                      aria-label="الصورة التالية"
                    >
                      ←
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs z-10">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square bg-white rounded-lg overflow-hidden transition-all ${
                        selectedImage === index 
                          ? 'ring-4 ring-gold shadow-lg scale-105' 
                          : 'ring-2 ring-gray-200 hover:ring-gold/50'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={`${product.name} - صورة ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details */}
            <div className="space-y-6" data-aos="fade-left">
              {/* Product Title */}
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark mb-3 leading-tight">
                  {product.name}
                </h1>
                
                {/* SKU & Rating */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {product.sku && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">كود المنتج:</span>
                      <span className="font-mono">{product.sku}</span>
                    </span>
                  )}
                  
                  {product.average_rating && parseFloat(product.average_rating) > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">
                            {i < Math.round(parseFloat(product.average_rating)) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs">({product.rating_count || 0} تقييم)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-gold/10 to-gold-dark/10 rounded-xl p-6 border-2 border-gold/20">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-gold">
                    {price.toFixed(2)}
                    <span className="text-xl mr-2">ر.س</span>
                  </span>
                  {isOnSale && (
                    <span className="text-xl text-gray-400 line-through">
                      {regularPrice.toFixed(2)} ر.س
                    </span>
                  )}
                </div>
                
                {isOnSale && (
                  <p className="text-sm text-green-600 font-medium">
                    🎉 وفّر {(regularPrice - price).toFixed(2)} ر.س ({discountPercentage}% خصم)
                  </p>
                )}

                {/* Stock Status */}
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
                  isOutOfStock 
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-green-100 text-green-700 border-2 border-green-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                  }`}></span>
                  {isOutOfStock ? 'غير متوفر حالياً' : 'متوفر في المخزون'}
                </div>
              </div>

              {/* Short Description */}
              {product.short_description && (
                <div 
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Variants/Attributes Selection */}
              {product.attributes && product.attributes.length > 0 && product.attributes.some(attr => attr.variation) && (
                <div className="space-y-4">
                  {product.attributes
                    .filter(attr => attr.variation)
                    .map((attribute, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-bold text-dark mb-2">
                          {attribute.name}:
                          {selectedOptions[attribute.name] && (
                            <span className="mr-2 text-gold">{selectedOptions[attribute.name]}</span>
                          )}
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {attribute.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionChange(attribute.name, option)}
                              className={`px-4 py-3 rounded-lg font-medium text-sm transition-all border-2 ${
                                selectedOptions[attribute.name] === option
                                  ? 'bg-gold text-white border-gold shadow-lg scale-105'
                                  : 'bg-white text-dark border-gray-300 hover:border-gold hover:text-gold'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-bold text-dark mb-2">الكمية:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg font-bold text-xl hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-gold outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg font-bold text-xl hover:border-gold hover:text-gold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid md:grid-cols-2 gap-3 pt-4">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || loading}
                  className="bg-gold text-white font-bold py-4 px-6 rounded-xl hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري المعالجة...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>اشتري الآن</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || loading}
                  className="bg-white border-2 border-gold text-gold font-bold py-4 px-6 rounded-xl hover:bg-gold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {addedToCart ? (
                    <>
                      <span>✓</span>
                      <span>تمت الإضافة</span>
                    </>
                  ) : (
                    <>
                      <span>🛒</span>
                      <span>أضف للسلة</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">🚚</div>
                  <p className="text-xs font-bold text-dark">شحن مجاني</p>
                  <p className="text-xs text-gray-600">لأكثر من 199 ريال</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-xs font-bold text-dark">تسليم فوري</p>
                  <p className="text-xs text-gray-600">للمنتجات الرقمية</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">↩️</div>
                  <p className="text-xs font-bold text-dark">إرجاع مجاني</p>
                  <p className="text-xs text-gray-600">خلال 14 يوم</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs font-bold text-dark">دفع آمن</p>
                  <p className="text-xs text-gray-600">محمي 100%</p>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-3 pt-4">
                <span className="text-sm font-medium text-gray-600">شارك المنتج:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                    W
                  </button>
                  <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    T
                  </button>
                  <button className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    X
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description & Specs Tabs */}
          {(product.description || (product.attributes && product.attributes.length > 0)) && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12" data-aos="fade-up">
              <div className="prose prose-lg max-w-none">
                {/* Description */}
                {product.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-dark">تفاصيل المنتج</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                )}

                {/* Technical Specs */}
                {product.attributes && product.attributes.filter(attr => !attr.variation).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-dark">المواصفات التقنية</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {product.attributes
                        .filter(attr => !attr.variation)
                        .map((attr, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <span className="font-bold text-dark">{attr.name}:</span>
                            <span className="mr-2 text-gray-700">
                              {Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {!product.description && product.attributes.filter(attr => !attr.variation).length === 0 && (
                  <p className="text-center text-gray-500">لا توجد مواصفات تقنية متاحة لهذا المنتج</p>
                )}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div data-aos="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-dark">منتجات ذات صلة</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.slice(0, 4).map((related) => (
                  <a
                    key={related.id}
                    href={`/products/${related.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={related.images?.[0]?.src || '/placeholder.jpg'}
                        alt={related.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                        {related.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gold">
                          {parseFloat(related.price).toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, req }) {
  const { slug } = params;
  
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'taplinksa.com';
    const baseUrl = `${protocol}://${host}`;

    const [productRes, relatedRes] = await Promise.all([
      fetch(`${baseUrl}/api/products/${slug}`),
      fetch(`${baseUrl}/api/products?per_page=4`).catch(() => ({ json: () => ({ products: [] }) }))
    ]);

    const product = await productRes.json();
    const relatedData = await relatedRes.json();

    if (!product || product.error) {
      return {
        props: {
          product: { error: true },
          relatedProducts: [],
        },
      };
    }

    return {
      props: {
        product,
        relatedProducts: relatedData.products || [],
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        product: { error: true },
        relatedProducts: [],
      },
    };
  }
}
