import { useState, useEffect } from 'react';
//import { NextSeo } from 'next-seo';
import Layout from '../../components/layout/Layout';
import ProductsGrid from '../../components/products/ProductsGrid';
import Pagination from '../../components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop({ initialProducts, initialCategories, initialTotal }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  const [currentCategory, setCurrentCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const perPage = 20;
  const totalPages = Math.ceil(totalProducts / perPage);

  // Scroll to top detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async (page = 1, category = '', sort = 'date', search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        orderby: sort,
        ...(category && { category }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalProducts(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
    fetchProducts(1, categoryId, sortBy, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    fetchProducts(currentPage, currentCategory, sort, searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, currentCategory, sortBy, searchTerm);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout title="المتجر | تاب لينك السعودية">
      <NextSeo
        title="متجر تاب لينك السعودية - اشتراكات رقمية وبطاقات ألعاب"
        description="تسوق أفضل الاشتراكات الرقمية وبطاقات الألعاب بأسعار منافسة مع توصيل فوري"
        canonical="https://taplinksa.com/shop"
        openGraph={{
          type: 'website',
          url: 'https://taplinksa.com/shop',
          title: 'متجر تاب لينك السعودية',
          description: 'تسوق أفضل الاشتراكات الرقمية',
          images: [
            {
              url: 'https://taplinksa.com/og-shop.jpg',
              width: 1200,
              height: 630,
              alt: 'تاب لينك السعودية',
            },
          ],
        }}
      />

      <div className="bg-gradient-to-br from-gold/5 via-white to-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gold via-gold-dark to-gold py-12 md:py-16">
          <div className="container-custom px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">متجر تاب لينك</h1>
              <p className="text-lg md:text-xl opacity-90">اكتشف أفضل المنتجات الرقمية والاشتراكات</p>
            </motion.div>
          </div>
        </div>

        <div className="container-custom px-3 md:px-8 py-6 md:py-12">
          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 sticky top-16 md:top-20 z-40"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold"
                  >
                    🔍
                  </button>
                </div>
              </form>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all bg-white"
              >
                <option value="date">الأحدث</option>
                <option value="popularity">الأكثر مبيعاً</option>
                <option value="price">السعر: من الأقل</option>
                <option value="price-desc">السعر: من الأعلى</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-gold text-white px-6 py-3 rounded-xl font-bold"
              >
                {showFilters ? 'إخفاء' : 'إظهار'} الفلاتر
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              عرض <strong>{products.length}</strong> من أصل <strong>{totalProducts}</strong> منتج
              {currentCategory && (
                <button
                  onClick={() => handleCategoryChange('')}
                  className="mr-2 text-gold hover:underline"
                >
                  × إزالة الفلتر
                </button>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            {/* Sidebar Filters */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 1024) && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="lg:col-span-1"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-36">
                    <h2 className="text-xl font-bold mb-4">التصنيفات</h2>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => handleCategoryChange('')}
                          className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                            !currentCategory
                              ? 'bg-gold text-white font-bold'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          🏠 جميع المنتجات
                        </button>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <button
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                              currentCategory === cat.id
                                ? 'bg-gold text-white font-bold'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {cat.name} ({cat.count})
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Trust Badges */}
                    <div className="mt-8 space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🚚</span>
                        <div>
                          <p className="font-bold">توصيل سريع</p>
                          <p className="text-gray-600 text-xs">1-3 أيام عمل</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🔒</span>
                        <div>
                          <p className="font-bold">دفع آمن</p>
                          <p className="text-gray-600 text-xs">معاملات محمية 100%</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">↩️</span>
                        <div>
                          <p className="font-bold">إرجاع مجاني</p>
                          <p className="text-gray-600 text-xs">خلال 14 يوم</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <ProductsGrid products={products} loading={loading} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 md:mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      fetchProducts(page, currentCategory, sortBy, searchTerm);
                      scrollToTop();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 bg-gold text-white p-4 rounded-full shadow-2xl hover:bg-gold-dark transition-colors z-50"
              aria-label="Scroll to top"
            >
              ↑
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?per_page=20&page=1`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
    ]);

    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();

    return {
      props: {
        initialProducts: productsData.products || [],
        initialCategories: categoriesData.categories || [],
        initialTotal: productsData.total || 0,
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
        initialCategories: [],
        initialTotal: 0,
      },
    };
  }
}
