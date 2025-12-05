import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ProductsGrid from '../../components/shop/ProductsGrid';
import Pagination from '../../components/Pagination';

export default function Shop({ initialProducts, initialCategories, initialTotal }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  const [currentCategory, setCurrentCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  const perPage = 20;
  const totalPages = Math.ceil(totalProducts / perPage);

  // Fetch products
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

      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
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
    setCurrentPage(1);
    fetchProducts(1, currentCategory, sortBy, searchTerm);
  };

  const resetFilters = () => {
    setCurrentCategory('');
    setSearchTerm('');
    setSortBy('date');
    setCurrentPage(1);
    fetchProducts(1, '', 'date', '');
  };

  const currentCategoryName = categories.find(c => c.id === currentCategory)?.name || 'جميع المنتجات';
  const activeFiltersCount = [currentCategory, searchTerm, sortBy !== 'date'].filter(Boolean).length;

  return (
    <Layout title={`المتجر - ${currentCategoryName} | تاب لينك السعودية`}>
      <Head>
        <title>متجر تاب لينك - {currentCategoryName}</title>
        <meta 
          name="description" 
          content="تسوق أفضل الاشتراكات الرقمية وبطاقات الألعاب بأسعار منافسة مع توصيل فوري" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gold/5 via-white to-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold via-gold-dark to-gold py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center text-white" data-aos="fade-up">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                {currentCategoryName}
              </h1>
              <p className="text-sm md:text-lg opacity-90">
                اكتشف أفضل المنتجات الرقمية والاشتراكات
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Search & Filters Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8" data-aos="fade-up">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-4 mb-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gold transition-colors"
                  >
                    🔍
                  </button>
                </div>
              </form>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-gold outline-none bg-white min-w-[160px]"
              >
                <option value="date">الأحدث</option>
                <option value="popularity">الأكثر مبيعاً</option>
                <option value="price">السعر: من الأقل</option>
                <option value="price-desc">السعر: من الأعلى</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-sm whitespace-nowrap transition-colors"
                >
                  مسح الفلاتر ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3 mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-gold outline-none text-sm"
                  />
                  <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-lg">
                    🔍
                  </button>
                </div>
              </form>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 outline-none text-sm"
                >
                  <option value="date">الأحدث</option>
                  <option value="popularity">الأكثر مبيعاً</option>
                  <option value="price">السعر ↑</option>
                  <option value="price-desc">السعر ↓</option>
                </select>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
                  >
                    مسح ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>

            {/* Categories - Horizontal Scroll on Mobile */}
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all snap-start ${
                    !currentCategory
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-dark'
                  }`}
                >
                  🏠 الكل
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all snap-start ${
                      currentCategory === cat.id
                        ? 'bg-gold text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-dark'
                    }`}
                  >
                    {cat.name}
                    <span className={`mr-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      currentCategory === cat.id ? 'bg-white/20' : 'bg-gray-300'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
              <div className="text-gray-600">
                عرض <strong className="text-gold font-bold">{products.length}</strong> من أصل{' '}
                <strong className="text-gold font-bold">{totalProducts}</strong> منتج
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-gold">
                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-medium">جاري التحميل...</span>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div data-aos="fade-up">
            <ProductsGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    fetchProducts(page, currentCategory, sortBy, searchTerm);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>

          {/* Trust Badges */}
          {!loading && products.length > 0 && (
            <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" data-aos="fade-up">
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-bold text-sm md:text-base mb-1">توصيل سريع</h3>
                <p className="text-xs text-gray-600">خلال 2-3 أيام عمل</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-bold text-sm md:text-base mb-1">دفع آمن</h3>
                <p className="text-xs text-gray-600">معاملات محمية 100%</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <div className="text-3xl mb-2">↩️</div>
                <h3 className="font-bold text-sm md:text-base mb-1">إرجاع مجاني</h3>
                <p className="text-xs text-gray-600">خلال 14 يوم من الاستلام</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-bold text-sm md:text-base mb-1">دعم 24/7</h3>
                <p className="text-xs text-gray-600">نحن هنا لمساعدتك دائماً</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'taplinksa.com';
    const baseUrl = `${protocol}://${host}`;

    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?per_page=20&page=1`),
      fetch(`${baseUrl}/api/categories`),
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
