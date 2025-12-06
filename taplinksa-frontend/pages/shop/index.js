import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import ShopHeader from '../../components/shop/ShopHeader';
import SearchBar from '../../components/shop/SearchBar';
import CategoriesFilter from '../../components/shop/CategoriesFilter';
import ShopFiltersBar from '../../components/shop/ShopFiltersBar';
import ProductsGrid from '../../components/shop/ProductsGrid';
import Pagination from '../../components/shop/Pagination';
import ShopFeatures from '../../components/shop/ShopFeatures';
import DigitalSubscriptionsBanner from '../../components/shop/DigitalSubscriptionsBanner';
import { motion } from 'framer-motion';

export default function Shop({ initialProducts, initialTotal, initialTotalPages, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSortBy, setCurrentSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Keep original API call logic EXACTLY
  const fetchProducts = async (page = 1, category = currentCategory, sort = currentSortBy, search = searchTerm) => {
    setLoading(true);

    let order = 'desc';
    let orderby = sort;

    if (sort === 'price') {
      order = 'asc';
      orderby = 'price';
    } else if (sort === 'price-desc') {
      order = 'desc';
      orderby = 'price';
    } else if (sort === 'popularity') {
      sort = 'rating';
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
          setProducts((prev) => [...prev, ...data.products]);
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
    fetchProducts(page, currentCategory, currentSortBy, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId = '') => {
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

  const handleSearchClear = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchProducts(1, currentCategory, currentSortBy, '');
  };

  return (
    <Layout
      title="المتجر - اشتراكات رقمية"
      description="تصفح مجموعة واسعة من الاشتراكات والخدمات الرقمية"
    >
      <div className="container-custom section-padding">
        {/* Digital Subscriptions Banner */}
        <DigitalSubscriptionsBanner />

        {/* Shop Header */}
        <ShopHeader />

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
          }}
          onSearchSubmit={handleSearch}
          onClear={handleSearchClear}
        />

        {/* Categories Filter */}
        <CategoriesFilter
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
          initialTotal={initialTotal}
        />

        {/* Filters Bar (Results Count + Sort) */}
        <ShopFiltersBar
          products={products}
          initialTotal={initialTotal}
          currentSortBy={currentSortBy}
          onSortChange={handleSortChange}
        />

        {/* Products Grid */}
        <ProductsGrid products={products} isLoading={loading} />

        {/* Pagination */}
        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        )}

        {/* Empty State with Clear Filters */}
        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">📭</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {searchTerm ? `لم نجد نتائج لـ "${searchTerm}"` : 'لا توجد منتجات في هذا القسم'}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm
                ? 'حاول البحث بكلمات مختلفة'
                : 'حاول تغيير المرشحات أو التصنيفات'}
            </p>
            {(searchTerm || currentCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentCategory('');
                  setCurrentPage(1);
                  fetchProducts(1, '', currentSortBy, '');
                }}
                className="bg-gold hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                مسح جميع الفلاتر
              </button>
            )}
          </motion.div>
        )}

        {/* Shop Features */}
        <ShopFeatures />
      </div>
    </Layout>
  );
}

// ✅ CORRECTED: getServerSideProps for dynamic pages
// Do NOT use revalidate - that's only for getStaticProps
// All props must be inside the props object
export async function getServerSideProps() {
  try {
    const { products: initialProducts, total: initialTotal, totalPages: initialTotalPages } = await getProducts(
      1,
      12,
      { status: 'publish' },
      { orderby: 'date', order: 'desc' }
    );

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
