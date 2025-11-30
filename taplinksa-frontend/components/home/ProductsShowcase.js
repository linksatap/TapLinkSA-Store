import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../lib/api'; // ✅ استخدم نفس الدالة

export default function ProductsShowcase() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
  try {
    setLoading(true);
    console.log('🔄 Fetching from API route...');
    
    const response = await fetch('/api/products?per_page=6');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Data received:', data);
    
    setProducts(data.products || []);
  } catch (error) {
    console.error('❌ Error:', error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};


  // استخراج الفئات
  const categories = [
    { slug: 'all', name: 'جميع المنتجات', icon: '📋' },
  ];

  if (products.length > 0) {
    const uniqueCategories = Array.from(
      new Set(
        products
          .filter(p => p.categories && Array.isArray(p.categories))
          .flatMap(p => p.categories.map(c => JSON.stringify({ slug: c.slug, name: c.name })))
      )
    ).map(cat => {
      const parsed = JSON.parse(cat);
      return {
        slug: parsed.slug,
        name: parsed.name,
        icon: parsed.slug.includes('nfc') ? '💳' : parsed.slug.includes('stand') ? '🎪' : '✨'
      };
    });
    
    categories.push(...uniqueCategories);
  }

  // فلترة المنتجات
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => 
        product.categories && 
        Array.isArray(product.categories) &&
        product.categories.some(cat => cat.slug === selectedCategory)
      );

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block text-6xl mb-4"
            >
              ⏳
            </motion.div>
            <p className="text-xl text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">💳</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            منتجاتنا <span className="text-gold">الذكية</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر المنتج المناسب لك واستمتع بحضور رقمي احترافي
          </p>
        </motion.div>

        {/* فلتر الفئات */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-gold text-dark shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* عرض المنتجات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product, index) => {
            const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
            const discountPercent = hasDiscount 
              ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
              : 0;

            return (
             <motion.div
  key={product.id}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  whileHover={{ y: -10, scale: 1.02 }}
  className="relative bg-white rounded-3xl shadow-xl overflow-hidden group flex flex-col"
>
  {/* Badge الخصم */}
  {hasDiscount && (
    <div className="absolute top-6 left-6 z-20">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
      >
        وفّر {discountPercent}%
      </motion.div>
    </div>
  )}

  {/* صورة المنتج */}
  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
    {product.images && product.images[0] ? (
      <Image
        src={product.images[0].src}
        alt={product.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <span className="text-8xl">💳</span>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>

  <div className="p-6 flex flex-col flex-1">
    {/* الفئات - ارتفاع ثابت */}
    <div className="h-8 mb-3 flex flex-wrap gap-2">
      {product.categories && product.categories.length > 0 && (
        <>
          {product.categories.slice(0, 2).map((cat) => (
            <span
              key={cat.id}
              className="text-xs px-3 py-1 bg-gold/10 text-gold rounded-full font-medium"
            >
              {cat.name}
            </span>
          ))}
        </>
      )}
    </div>

    {/* اسم المنتج - ارتفاع ثابت */}
    <h3 className="text-xl font-bold mb-3 line-clamp-2 h-14">
      {product.name}
    </h3>

    {/* الوصف - ارتفاع ثابت */}
    <div className="h-10 mb-4">
      {product.short_description && (
        <div
          className="text-sm text-gray-600 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}
    </div>

    {/* السعر */}
    <div className="flex items-end gap-3 mb-4">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-dark">
          {parseFloat(product.price).toFixed(0)}
        </span>
        <span className="text-lg text-gray-600">ر.س</span>
      </div>
      {hasDiscount && (
        <span className="text-lg text-gray-400 line-through mb-1">
          {parseFloat(product.regular_price).toFixed(0)} ر.س
        </span>
      )}
    </div>

    {/* التقييم - ارتفاع ثابت */}
    <div className="h-8 mb-4">
      {product.average_rating && parseFloat(product.average_rating) > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.round(parseFloat(product.average_rating))
                    ? 'text-gold'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.rating_count})
          </span>
        </div>
      )}
    </div>

    {/* الأزرار - في الأسفل */}
    <div className="flex flex-col gap-3 mt-auto">
      {product.stock_status === 'instock' ? (
        <>
          <button
            onClick={() => {
              handleAddToCart(product);
              setTimeout(() => {
                window.location.href = '/checkout';
              }, 300);
            }}
            className="w-full py-3 rounded-xl font-bold bg-gold text-dark hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
          >
            🛒 اشتري الآن
          </button>
          
          <button
            onClick={() => handleAddToCart(product)}
            className="w-full py-3 rounded-xl font-bold bg-gray-100 text-dark hover:bg-gray-200 transition-all"
          >
            أضف للسلة
          </button>
        </>
      ) : (
        <button
          disabled
          className="w-full py-3 rounded-xl font-bold bg-gray-300 text-gray-500 cursor-not-allowed"
        >
          نفذت الكمية
        </button>
      )}
    </div>

    {/* معلومات إضافية */}
    <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
      🚚 شحن سريع
    </div>
  </div>
</motion.div>

            );
          })}
        </div>

        {/* رسالة في حال عدم وجود منتجات */}
        {filteredProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">
              {products.length === 0 ? '📦' : '🔍'}
            </div>
            <p className="text-xl text-gray-600">
              {products.length === 0 ? 'لا توجد منتجات' : 'لا توجد منتجات في هذه الفئة'}
            </p>
          </motion.div>
        )}

        {/* زر عرض جميع المنتجات */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link 
              href="/shop" 
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              عرض جميع المنتجات
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
