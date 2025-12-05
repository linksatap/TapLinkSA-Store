import { useState } from 'react';
import { getProducts } from '../../lib/api'; // استيراد دالة جلب المنتجات
import axios from 'axios';
import { getCategories } from '../../lib/api'; // استيراد دالة جلب الفئات
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/shop/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Shop({ initialProducts, initialTotal, initialTotalPages, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [currentCategory, setCurrentCategory] = useState(''); // ✅ حالة الفئة الحالية
  const [currentSortBy, setCurrentSortBy] = useState('date'); // ✅ حالة الترتيب الحالية
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);


  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async (page, category = currentCategory, sort = currentSortBy, search = searchTerm) => {
    setLoading(true);
    
    let order = 'desc'; // القيمة الافتراضية للترتيب (تنازلي)
    let orderby = sort;
    
    // منطق خاص للترتيب حسب السعر
    if (sort === 'price') {
      order = 'asc'; // السعر: الأقل أولاً (تصاعدي)
      orderby = 'price';
    } else if (sort === 'price-desc') {
      order = 'desc'; // السعر: الأعلى أولاً (تنازلي)
      orderby = 'price';
    } else if (sort === 'popularity' || sort === 'rating') {
      order = 'desc'; // الأكثر مبيعاً والأعلى تقييماً (تنازلي)
    }
    
    try {
      const response = await fetch(
        `/api/products?page=${page}&per_page=12&category=${category}&orderby=${orderby}&order=${order}&search=${search}`
      );
      const data = await response.json();
      
      if (data.products) {
        // إذا كانت الصفحة 1، نستبدل المنتجات. وإلا، نضيفها (منطق التحميل الإضافي)
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts(prev => [...prev, ...data.products]);
        }
        setTotalPages(data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchProducts(page, selectedCategory, sortBy, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
    fetchProducts(1, categoryId, currentSortBy, searchTerm);
  };

  const handleSortChange = (sort) => {
    setCurrentSortBy(sort);
    setCurrentPage(1);
    fetchProducts(1, currentCategory, sort, searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, currentCategory, currentSortBy, searchTerm);
  };

  return (
    <Layout
      title="المتجر | تاب لينك السعودية"
      description="تسوق بطاقات NFC الذكية والحوامل الذكية من تاب لينك السعودية"
    >
      <div className="container-custom section-padding">
        
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-gold transition-colors">
                الرئيسية
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">المتجر</li>
          </ol>
        </nav>

        {/* Banner for Digital Subscriptions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-4xl">💎</span>
            <div>
              <h3 className="text-blue-900 font-bold text-lg mb-1">
                اشتراكات رقمية مميزة
              </h3>
              <p className="text-blue-700 text-sm">
                تبحث عن Canva Pro، Netflix، أو اشتراكات أخرى؟ تصفح قسمنا الخاص
              </p>
            </div>
          </div>
          <Link
            href="/subscriptions"
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
          >
            الاشتراكات الرقمية ←
          </Link>
        </motion.div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            متجر تاب لينك السعودية
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.2 }}
            className="h-1 bg-gold mx-auto mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            اكتشف مجموعتنا المميزة من البطاقات الذكية والحوامل المبتكرة
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 ابحث عن المنتجات..."
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-gold outline-none text-lg transition-all shadow-lg"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all"
              >
                بحث
              </button>
            </div>
          </form>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-2xl shadow-lg p-6">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentCategory === '' 
                  ? 'bg-gold text-dark shadow-lg scale-105' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              الكل ({initialTotal})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentCategory === cat.id.toString() 
                    ? 'bg-gold text-dark shadow-lg scale-105' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">ترتيب:</label>
            <select
              value={currentSortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-gold outline-none bg-white cursor-pointer font-medium"
            >
              <option value="date">الأحدث</option>
              <option value="popularity">الأكثر مبيعاً</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="price">السعر: الأقل أولاً</option>
              <option value="price-desc">السعر: الأعلى أولاً</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-gold">{products.length}</span> من أصل{' '}
            <span className="font-bold">{initialTotal}</span> منتج
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="bg-gray-200 rounded-2xl animate-pulse" 
                style={{ height: '500px' }} 
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  السابق
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  
                  // عرض الصفحات القريبة فقط
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          currentPage === page
                            ? 'bg-gold text-dark border-gold font-bold shadow-lg'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-8xl mb-6"
            >
              🔍
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">لا توجد منتجات</h2>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm 
                ? `لم نجد نتائج لـ "${searchTerm}"`
                : 'لا توجد منتجات في هذا القسم حالياً'
              }
            </p>
            {(searchTerm || currentCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');

                  setCurrentCategory('');
                  fetchProducts(1, '', currentSortBy, '');
                }}
                className="btn-primary"
              >
                عرض جميع المنتجات
              </button>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-lg mb-2">شحن سريع</h3>
            <p className="text-sm text-gray-600">توصيل خلال 2-3 أيام عمل</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2">دفع آمن</h3>
            <p className="text-sm text-gray-600">معاملات محمية 100%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-3">↩️</div>
            <h3 className="font-bold text-lg mb-2">إرجاع مجاني</h3>
            <p className="text-sm text-gray-600">خلال 14 يوم من الاستلام</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">دعم 24/7</h3>
            <p className="text-sm text-gray-600">نحن هنا لمساعدتك دائماً</p>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
}

// ✅ SSR - Server-Side Rendering
export async function getServerSideProps() {
  try {
    // جلب المنتجات باستخدام الدالة المحسّنة والمخزنة مؤقتاً
    const { products: initialProducts, total: initialTotal, totalPages: initialTotalPages } = await getProducts(1, 12, {
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });

    // جلب الفئات باستخدام الدالة المحسّنة والمخزنة مؤقتاً
    const categories = await getCategories();

    return {
      props: {
        initialProducts,
        initialTotal,
        initialTotalPages,
        categories,
      },
    };
  } catch (error) {
    console.error('Error in SSR:', error.message);
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
        initialTotalPages: 0,
        categories: [],
      },
    };
  }
}
