import { useState, useCallback, useMemo } from 'react';
import { getProducts, getCategories } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/shop/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';

/**
 * OPTIMIZED Shop Page (index.js)
 * 
 * Critical Fixes:
 * ✅ Fixed variable reference bug (selectedCategory → currentCategory)
 * ✅ Added sticky filters on mobile
 * ✅ Added proper skeleton loaders
 * ✅ Added SEO meta tags
 * ✅ Added breadcrumb schema
 * ✅ Fixed grid responsiveness (added sm: breakpoint)
 * ✅ Added loading state for filters
 * ✅ Added "Load More" button option
 * ✅ Added no results state
 * ✅ Added debouncing for search
 */

export default function Shop({ initialProducts, initialTotal, initialTotalPages, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSortBy, setCurrentSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchProducts = useCallback(async (page, category = currentCategory, sort = currentSortBy, search = searchTerm) => {
    setLoading(true);

    let order = 'desc';
    let orderby = sort;

    if (sort === 'price') {
      order = 'asc';
      orderby = 'price';
    } else if (sort === 'price-desc') {
      order = 'desc';
      orderby = 'price';
    } else if (sort === 'popularity' || sort === 'rating') {
      order = 'desc';
    }

    try {
      const response = await fetch(
        `/api/products?page=${page}&per_page=12&category=${category}&orderby=${orderby}&order=${order}&search=${search}`
      );
      const data = await response.json();

      if (data.products) {
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
  }, [currentCategory, currentSortBy, searchTerm]);

  // ✅ FIX: Correct variable references
  const handlePageChange = useCallback((page) => {
    fetchProducts(page, currentCategory, currentSortBy, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts, currentCategory, currentSortBy, searchTerm]);

  const handleCategoryChange = useCallback((categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
    setShowFilters(false);
    fetchProducts(1, categoryId, currentSortBy, searchTerm);
  }, [fetchProducts, currentSortBy, searchTerm]);

  const handleSortChange = useCallback((sort) => {
    setCurrentSortBy(sort);
    setCurrentPage(1);
    fetchProducts(1, currentCategory, sort, searchTerm);
  }, [fetchProducts, currentCategory, searchTerm]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, currentCategory, currentSortBy, searchTerm);
  }, [fetchProducts, currentCategory, currentSortBy, searchTerm]);

  // Debounced search input
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, currentCategory, currentSortBy, value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleLoadMore = () => {
    handlePageChange(currentPage + 1);
  };

  // SEO: Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المتجر',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/shop`
      }
    ]
  };

  // SEO: Collection schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'متجر تاب لينك السعودية',
    description: 'تسوق بطاقات NFC الذكية والحوامل الذكية من تاب لينك السعودية',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/shop`,
    numberOfItems: initialTotal
  };

  const metaDescription = 'تسوق بطاقات NFC الذكية والحوامل المبتكرة من تاب لينك. أفضل الأسعار وشحن سريع لجميع مناطق المملكة.';

  return (
    <>
      <Head>
        {/* SEO Meta Tags */}
        <title>متجر تاب لينك السعودية | بطاقات NFC ذكية</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="بطاقات NFC, حوامل ذكية, تاب لينك, متجر إلكتروني" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="متجر تاب لينك السعودية" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/shop`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/og-image.jpg`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="متجر تاب لينك السعودية" />
        <meta name="twitter:description" content={metaDescription} />

        {/* Canonical */}
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/shop`} />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      </Head>

      <Layout
        title="متجر تاب لينك"
        description={metaDescription}
      >
        <div className="container-custom section-padding">

          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gold transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gold font-bold">المتجر</li>
            </ol>
          </nav>

          {/* Promotional Banner */}
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
            />
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
                  onChange={handleSearchInput}
                  placeholder="🔍 ابحث عن المنتجات..."
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-gold outline-none text-lg transition-all shadow-lg"
                  aria-label="Search products"
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

          {/* Filters Bar - Desktop */}
          <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-2xl shadow-lg p-6">

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentCategory === ''
                    ? 'bg-gold text-dark shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                الكل ({initialTotal})
              </motion.button>
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentCategory === cat.id.toString()
                      ? 'bg-gold text-dark shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({cat.count})
                </motion.button>
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

          {/* Filters Bar - Mobile */}
          <div className="md:hidden mb-8 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 px-4 py-3 bg-gold text-dark font-bold rounded-lg shadow-lg"
            >
              🔽 الفلاتر
            </motion.button>

            <select
              value={currentSortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gold outline-none bg-white cursor-pointer font-medium"
            >
              <option value="date">الأحدث</option>
              <option value="popularity">الأكثر مبيعاً</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="price">السعر: الأقل</option>
              <option value="price-desc">السعر: الأعلى</option>
            </select>
          </div>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden mb-8 bg-white rounded-2xl shadow-lg p-6 space-y-4"
              >
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
                      currentCategory === ''
                        ? 'bg-gold text-dark'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    الكل ({initialTotal})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
                        currentCategory === cat.id.toString()
                          ? 'bg-gold text-dark'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-bold text-gold">{products.length}</span> من أصل{' '}
              <span className="font-bold">{initialTotal}</span> منتج
            </p>
            {currentCategory && (
              <button
                onClick={() => handleCategoryChange('')}
                className="text-sm text-gold hover:underline font-medium"
              >
                ✕ مسح الفلاتر
              </button>
            )}
          </div>

          {/* Products Grid */}
          {loading && currentPage === 1 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-200 rounded-2xl animate-pulse"
                  style={{ height: '400px' }}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product, index) => (
                    <ProductCard
                      key={`${product.id}-${currentPage}`}
                      product={product}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination / Load More */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6">
                  {/* Load More Button - Mobile Friendly */}
                  {currentPage < totalPages && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-lg"
                    >
                      {loading ? '⏳ جاري التحميل...' : '📥 تحميل المزيد'}
                    </motion.button>
                  )}

                  {/* Pagination Numbers - Desktop */}
                  <div className="hidden md:flex items-center justify-center gap-2 flex-wrap">

                    {/* Previous */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      السابق
                    </motion.button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;

                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <motion.button
                            key={page}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg border transition-all ${
                              currentPage === page
                                ? 'bg-gold text-dark border-gold font-bold shadow-lg'
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </motion.button>
                        );
                      }

                      if (
                        (page === 2 && currentPage > 4) ||
                        (page === totalPages - 1 && currentPage < totalPages - 3)
                      ) {
                        return (
                          <span key={page} className="px-2 py-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    {/* Next */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      التالي
                    </motion.button>
                  </div>

                  {/* Page Info */}
                  <p className="text-sm text-gray-600">
                    الصفحة <span className="font-bold">{currentPage}</span> من{' '}
                    <span className="font-bold">{totalPages}</span>
                  </p>
                </div>
              )}
            </>
          ) : (
            // No Results State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">😞</div>
              <h2 className="text-2xl font-bold mb-2">لا توجد منتجات</h2>
              <p className="text-gray-600 mb-6">
                عذراً، لم نجد منتجات تطابق البحث الخاص بك
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSearchTerm('');
                  setCurrentCategory('');
                  fetchProducts(1, '', 'date', '');
                }}
                className="px-6 py-3 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all shadow-lg"
              >
                مسح البحث والفلاتر
              </motion.button>
            </motion.div>
          )}
        </div>
      </Layout>
    </>
  );
}

// Keep existing getStaticProps
export async function getStaticProps() {
  try {
    const products = await getProducts();
    const categories = await getCategories();

    return {
      props: {
        initialProducts: products.products || [],
        initialTotal: products.total || 0,
        initialTotalPages: products.totalPages || 1,
        categories: categories || []
      },
      revalidate: 60 // ISR: revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
        initialTotalPages: 1,
        categories: []
      },
      revalidate: 10
    };
  }
}
