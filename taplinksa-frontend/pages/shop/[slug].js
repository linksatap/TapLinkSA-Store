import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//import { NextSeo, ProductJsonLd, BreadcrumbJsonLd } from 'next-seo';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import ProductImageGallery from '../../components/ProductImageGallery';
import StickyAddToCart from '../../components/StickyAddToCart';

export default function ProductPage({ product, relatedProducts }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Sticky CTA detection
  useEffect(() => {
    const handleScroll = () => {
      const ctaElement = document.getElementById('main-cta');
      if (ctaElement) {
        const rect = ctaElement.getBoundingClientRect();
        setIsSticky(rect.top < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (router.isFallback) {
    return (
      <Layout>
        <div className="container-custom min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-xl">جاري تحميل المنتج...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">😞</div>
            <h1 className="text-3xl font-bold mb-4">عذراً، لم نتمكن من العثور على هذا المنتج</h1>
            <button onClick={() => router.push('/shop')} className="btn-primary">
              العودة للمتجر
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const discount = regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  const images = product.images?.length > 0 ? product.images : [{ src: '/placeholder-product.jpg' }];

  const breadcrumbs = [
    { name: 'الرئيسية', url: 'https://taplinksa.com' },
    { name: 'المتجر', url: 'https://taplinksa.com/shop' },
    ...(product.categories?.length > 0 
      ? [{ name: product.categories[0].name, url: `https://taplinksa.com/shop?category=${product.categories[0].id}` }]
      : []
    ),
    { name: product.name, url: `https://taplinksa.com/products/${product.slug}` },
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success toast
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <Layout title={`${product.name} | تاب لينك السعودية`}>
      {/* SEO */}
      <NextSeo
        title={`${product.name} - تاب لينك السعودية`}
        description={product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160) || `اشتري ${product.name} بأفضل سعر`}
        canonical={`https://taplinksa.com/products/${product.slug}`}
        openGraph={{
          type: 'product',
          url: `https://taplinksa.com/products/${product.slug}`,
          title: product.name,
          description: product.short_description?.replace(/<[^>]*>/g, ''),
          images: images.map(img => ({
            url: img.src,
            width: 800,
            height: 800,
            alt: product.name,
          })),
          product: {
            price: {
              amount: price,
              currency: 'SAR',
            },
            availability: product.stock_status === 'instock' ? 'in stock' : 'out of stock',
            condition: 'new',
          },
        }}
      />

      {/* Product Schema */}
      <ProductJsonLd
        productName={product.name}
        images={images.map(img => img.src)}
        description={product.short_description?.replace(/<[^>]*>/g, '')}
        brand="تاب لينك السعودية"
        offers={[
          {
            price: price.toFixed(2),
            priceCurrency: 'SAR',
            availability: product.stock_status === 'instock' 
              ? 'https://schema.org/InStock' 
              : 'https://schema.org/OutOfStock',
            url: `https://taplinksa.com/products/${product.slug}`,
            seller: {
              name: 'تاب لينك السعودية',
            },
          },
        ]}
        aggregateRating={
          product.average_rating && parseFloat(product.average_rating) > 0
            ? {
                ratingValue: product.average_rating,
                reviewCount: product.rating_count || 1,
              }
            : undefined
        }
        sku={product.sku}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbJsonLd itemListElements={breadcrumbs.map((item, index) => ({
        position: index + 1,
        name: item.name,
        item: item.url,
      }))} />

      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container-custom px-4 md:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2 whitespace-nowrap">
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <a href={crumb.url} className="text-gray-600 hover:text-gold">
                        {crumb.name}
                      </a>
                      <span className="text-gray-400">/</span>
                    </>
                  ) : (
                    <span className="text-gold font-bold">{crumb.name}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="container-custom px-4 md:px-8 py-6 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <ProductImageGallery 
                images={images} 
                productName={product.name}
                onSale={product.on_sale}
                discount={discount}
              />
            </motion.div>

            {/* Right: Product Info & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Product Name */}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-dark mb-3">
                  {product.name}
                </h1>
                {product.sku && (
                  <p className="text-sm text-gray-500">كود المنتج: {product.sku}</p>
                )}
              </div>

              {/* Rating & Reviews */}
              {product.average_rating && parseFloat(product.average_rating) > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex text-yellow-400 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.round(parseFloat(product.average_rating)) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({product.rating_count || 0} تقييم)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="bg-gradient-to-r from-gold/10 to-transparent p-6 rounded-2xl border-2 border-gold/20">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl md:text-5xl font-bold text-gold">
                    {price.toFixed(2)} ر.س
                  </span>
                  {product.on_sale && regularPrice > price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {regularPrice.toFixed(2)} ر.س
                      </span>
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        وفر {discount}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">شامل ضريبة القيمة المضافة</p>
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                product.stock_status === 'instock'
                  ? 'bg-green-50 text-green-700 border-2 border-green-200'
                  : 'bg-red-50 text-red-700 border-2 border-red-200'
              }`}>
                <span className={`w-3 h-3 rounded-full ${
                  product.stock_status === 'instock' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></span>
                <span className="font-bold">
                  {product.stock_status === 'instock' ? '✓ متوفر في المخزون' : '✗ غير متوفر حالياً'}
                </span>
              </div>

              {/* Trust Badges - Above Fold */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">🚚</div>
                  <p className="text-xs font-bold">شحن مجاني</p>
                  <p className="text-xs text-gray-500">+199 ر.س</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-xs font-bold">تسليم سريع</p>
                  <p className="text-xs text-gray-500">1-3 أيام</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">↩️</div>
                  <p className="text-xs font-bold">إرجاع مجاني</p>
                  <p className="text-xs text-gray-500">14 يوم</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs font-bold">دفع آمن</p>
                  <p className="text-xs text-gray-500">محمي 100%</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div id="main-cta" className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-bold text-lg">الكمية:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_status !== 'instock'}
                    className="bg-white border-2 border-gold text-gold font-bold py-4 px-6 rounded-xl hover:bg-gold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    🛒 إضافة للسلة
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock_status !== 'instock'}
                    className="bg-gold text-white font-bold py-4 px-6 rounded-xl hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                  >
                    🚀 اشتري الآن
                  </button>
                </div>

                <button className="w-full bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 px-6 rounded-xl transition-all">
                  ❤️ أضف للمفضلة
                </button>
              </div>

              {/* Short Description */}
              {product.short_description && (
                <div 
                  className="prose prose-sm max-w-none bg-white p-6 rounded-2xl shadow-md"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}
            </motion.div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            {/* Product description, specs, reviews tabs here */}
          </div>

          {/* Related Products */}
          {relatedProducts?.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">منتجات ذات صلة</h2>
              <ProductsGrid products={relatedProducts.slice(0, 5)} />
            </div>
          )}
        </div>

        {/* Sticky Mobile CTA */}
        <StickyAddToCart
          show={isSticky}
          product={product}
          price={price}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
    </Layout>
  );
}
