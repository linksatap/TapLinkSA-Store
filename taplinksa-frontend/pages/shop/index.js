import { useState, useEffect, useMemo } from 'react';
//import { NextSeo, BreadcrumbJsonLd } from 'next-seo';
import Layout from '../../components/layout/Layout';
import ProductsGrid from '../../components/shop/ProductsGrid';
import Pagination from '../../components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop({ initialProducts, initialCategories, initialTotal }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);
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

  // Scroll detection for "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products function
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
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Category change handler
  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
    fetchProducts(1, categoryId, sortBy, searchTerm);
    scrollToTop();
  };

  // Sort change handler
  const handleSortChange = (sort) => {
    setSortBy(sort);
    fetchProducts(currentPage, currentCategory, sort, searchTerm);
  };

  // Search submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, currentCategory, sortBy, searchTerm);
  };

  // Reset filters
  const resetFilters = () => {
    setCurrentCategory('');
    setSearchTerm('');
    setSortBy('date');
    setCurrentPage(1);
    fetchProducts(1, '', 'date', '');
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory) count++;
    if (searchTerm) count++;
    if (sortBy !== 'date') count++;
    return count;
  }, [currentCategory, searchTerm, sortBy]);

  // Current category name
  const currentCategoryName = useMemo(() => {
    const cat = categories.find(c => c.id === currentCategory);
    return cat?.name || 'جميع المنتجات';
  }, [currentCategory, categories]);

  return (
    <Layout title={`المتجر - ${currentCategoryName} | تاب لينك السعودية`}>
      {/* SEO */}
      <NextSeo
        title={`متجر تاب لينك - ${currentCategoryName}`}
        description="تسوق أفضل الاشتراكات الرقمية وبطاقات الألعاب بأسعار منافسة مع توصيل فوري"
        canonical="https://taplinksa.com/shop"
        openGraph={{
          type: 'website',
          url: 'https://taplinksa.com/shop',
          title: `متجر تاب لينك - ${currentCategoryName}`,
          description: 'تسوق أفضل الاشتراكات الرقمية وبطاقات الألعاب',
          images: [
            {
              url: 'https://taplinksa.com/og-shop.jpg',
              width: 1200,
              height: 630,
              alt: 'متجر تاب لينك السعودية',
            },
          ],
        }}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'الرئيسية',
            item: 'https://taplinksa.com',
          },
          {
            position: 2,
            name: 'المتجر',
            item: 'https://taplinksa.com/shop',
          },
          ...(currentCategory ? [{
            position: 3,
            name: currentCategoryName,
            item: `https://taplinksa.com/shop?category=${currentCategory}`,
          }] : []),
        ]}
      />

      <div className="bg-gradient-to-br from-gold/5 via-white to-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gold via-gold-dark to-gold py-8 md:py-12">
          <div className="container-custom px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                {currentCategoryName}
              </h1>
              <p className="text-sm md:text-lg opacity-90">
                اكتشف أفضل المنتجات الرقمية والاشتراكات
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container-custom px-3 md:px-8 py-4 md:py-8">
          {/* Search & Filter Bar - Sticky */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-6 mb-4 md:mb-8 sticky top-14 md:top-16 z-40"
          >
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gold transition-colors"
                  >
                    🔍
                  </button>
                </div>
              </form>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all bg-white text-sm min-w-[160px]"
              >
                <option value="date">الأحدث</option>
                <option value="popularity">الأكثر مبيعاً</option>
                <option value="price">السعر: من الأقل</option>
                <option value="price-desc">السعر: من الأعلى</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>

              {/* Reset Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors whitespace-nowrap"
                >
                  مسح الفلاتر ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-lg text-gray-400"
                  >
                    🔍
                  </button>
                </div>
              </form>

              {/* Filters Row */}
              <div className="flex gap-2">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-gold outline-none text-sm"
                >
                  <option value="date">الأحدث</option>
                  <option value="popularity">الأكثر مبيعاً</option>
                  <option value="price">السعر ↑</option>
                  <option value="price-desc">السعر ↓</option>
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative bg-gold text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap"
                >
                  الفئات
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600 flex items-center justify-between">
              <div>
                عرض <strong className="text-gold">{products.length}</strong> من أصل{' '}
                <strong className="text-gold">{totalProducts}</strong> منتج
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-gold hover:underline md:hidden"
                >
                  × مسح
                </button>
              )}
            </div>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-4 gap-4 md:gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-36">
                <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                  <span>التصنيفات</span>
                  {activeFiltersCount > 0 && (
                    <span className="text-xs bg-gold text-white px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                
                <ul className="space-y-2 mb-6">
                  <li>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-right px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        !currentCategory
                          ? 'bg-gold text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      🏠 جميع المنتجات
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full text-right px-4 py-2.5 rounded-lg transition-all text-sm flex items-center justify-between ${
                          currentCategory === cat.id
                            ? 'bg-gold text-white shadow-md font-bold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          currentCategory === cat.id
                            ? 'bg-white/20'
                            : 'bg-gray-200'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Trust Badges */}
                <div className="space-y-4 pt-6 border-t text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="font-bold text-dark">توصيل سريع</p>
                      <p className="text-gray-600 text-xs">1-3 أيام عمل</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <p className="font-bold text-dark">دفع آمن</p>
                      <p className="text-gray-600 text-xs">معاملات محمية 100%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">↩️</span>
                    <div>
                      <p className="font-bold text-dark">إرجاع مجاني</p>
                      <p className="text-gray-600 text-xs">خلال 14 يوم</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {showFilters && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  />

                  {/* Drawer */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-y-auto"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">الفئات</h2>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-2xl text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>

                      <ul className="space-y-2">
                        <li>
                          <button
                            onClick={() => {
                              handleCategoryChange('');
                              setShowFilters(false);
                            }}
                            className={`w-full text-right px-4 py-3 rounded-lg transition-all ${
                              !currentCategory
                                ? 'bg-gold text-white font-bold'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            🏠 جميع المنتجات
                          </button>
                        </li>
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <button
                              onClick={() => {
                                handleCategoryChange(cat.id);
                                setShowFilters(false);
                              }}
                              className={`w-full text-right px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                                currentCategory === cat.id
                                  ? 'bg-gold text-white font-bold'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              <span>{cat.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                currentCategory === cat.id
                                  ? 'bg-white/20'
                                  : 'bg-gray-300'
                              }`}>
                                {cat.count}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <ProductsGrid products={products} loading={loading} />

              {/* Pagination */}
              {!loading && totalPages > 1 && (
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
              className="fixed bottom-6 left-6 bg-gold text-white p-4 rounded-full shadow-2xl hover:bg-gold-dark transition-colors z-50 text-xl"
              aria-label="العودة للأعلى"
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
    console.error('Error fetching shop data:', error);
    return {
      props: {
        initialProducts: [],
        initialCategories: [],
        initialTotal: 0,
      },
    };
  }
}
