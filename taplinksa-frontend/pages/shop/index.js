import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Head from 'next/head';

// Components
import ShopHeader from '../../components/shop/ShopHeader';
import ShopFiltersBar from '../../components/shop/ShopFiltersBar';
import ProductsGrid from '../../components/shop/ProductsGrid';
import Pagination from '../../components/shop/Pagination';
import ShopFeatures from '../../components/shop/ShopFeatures';

// ============================================
// API FUNCTIONS - Now call OUR routes
// ============================================

/**
 * Fetch products from our API route (not WC directly)
 */
async function fetchProducts(page = 1, category = null, searchTerm = '', sortBy = 'latest') {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (category) params.append('category', category);
    if (searchTerm) params.append('search', searchTerm);
    params.append('sortBy', sortBy);

    const url = `/api/shop/products?${params.toString()}`;
    console.log(`📡 Fetching from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      return { data: [], total: 0, totalPages: 1 };
    }

    const result = await response.json();
    console.log(`✅ Got ${result.data?.length || 0} products`);

    return {
      data: result.data || [],
      total: result.total || 0,
      totalPages: result.totalPages || 1,
    };
  } catch (error) {
    console.error('❌ fetchProducts error:', error.message);
    return { data: [], total: 0, totalPages: 1 };
  }
}

/**
 * Fetch categories from our API route
 */
async function fetchCategories() {
  try {
    const response = await fetch('/api/shop/categories');

    if (!response.ok) {
      console.error(`❌ Categories API Error: ${response.status}`);
      return [];
    }

    const result = await response.json();
    console.log(`✅ Loaded ${result.data?.length || 0} categories`);

    return result.data || [];
  } catch (error) {
    console.error('❌ fetchCategories error:', error.message);
    return [];
  }
}

// ============================================
// SERVER-SIDE PROPS
// ============================================

export async function getServerSideProps({ query }) {
  try {
    const page = parseInt(query.page) || 1;
    const category = query.category || null;
    const search = query.search || '';
    const sort = query.sort || 'latest';

    console.log('🔄 getServerSideProps - Fetching initial data...');

    // Fetch from API routes
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/shop/products?page=${page}&category=${category || ''}&search=${search}&sortBy=${sort}`
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/shop/categories`
      ),
    ]);

    let products = [];
    let categories = [];
    let total = 0;
    let totalPages = 1;

    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      products = productsData.data || [];
      total = productsData.total || 0;
      totalPages = productsData.totalPages || 1;
    }

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      categories = categoriesData.data || [];
    }

    return {
      props: {
        initialProducts: products,
        initialCategories: categories,
        initialPage: page,
        initialCategory: category,
        initialSearch: search,
        initialSort: sort,
        initialTotal: total,
        initialTotalPages: totalPages,
      },
    };
  } catch (error) {
    console.error('❌ getServerSideProps error:', error);

    return {
      props: {
        initialProducts: [],
        initialCategories: [],
        initialPage: 1,
        initialCategory: null,
        initialSearch: '',
        initialSort: 'latest',
        initialTotal: 0,
        initialTotalPages: 1,
      },
    };
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Shop({
  initialProducts = [],
  initialCategories = [],
  initialPage = 1,
  initialCategory = null,
  initialSearch = '',
  initialSort = 'latest',
  initialTotal = 0,
  initialTotalPages = 1,
}) {
  const router = useRouter();

  // State
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  const [hasError, setHasError] = useState(false);

  // Initialize AOS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out-quad',
        once: true,
      });
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await fetchProducts(1, selectedCategory, searchTerm, sortBy);

      setProducts(data.data);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);
      setCurrentPage(1);

      // Update URL
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (searchTerm) params.set('search', searchTerm);
      if (sortBy !== 'latest') params.set('sort', sortBy);

      router.push(
        {
          pathname: '/shop',
          query: Object.fromEntries(params),
        },
        undefined,
        { shallow: true }
      );
    } catch (err) {
      console.error('Error applying filters:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, router]);

  // Handle page change
  const handlePageChange = useCallback(
    async (page) => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const data = await fetchProducts(page, selectedCategory, searchTerm, sortBy);
        setProducts(data.data);
        setCurrentPage(page);

        const params = new URLSearchParams();
        params.set('page', page);
        if (selectedCategory) params.set('category', selectedCategory);
        if (searchTerm) params.set('search', searchTerm);
        if (sortBy !== 'latest') params.set('sort', sortBy);

        router.push(
          {
            pathname: '/shop',
            query: Object.fromEntries(params),
          },
          undefined,
          { shallow: true }
        );
      } catch (err) {
        console.error('Error changing page:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, searchTerm, sortBy, router]
  );

  // Trigger filter changes
  useEffect(() => {
    if (currentPage === 1) {
      applyFilters();
    } else {
      setCurrentPage(1);
    }
  }, [selectedCategory, searchTerm, sortBy]);

  // Handlers
  const handleCategorySelect = (cat) => setSelectedCategory(cat);
  const handleSearch = (term) => setSearchTerm(term);
  const handleSort = (sort) => setSortBy(sort);

  return (
    <>
      <Head>
        <title>متجرنا | أفضل المنتجات والعروض</title>
        <meta
          name="description"
          content="تصفح مجموعتنا الواسعة من المنتجات عالية الجودة"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {hasError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
            ⚠️ حدث خطأ في تحميل المنتجات. يرجى المحاولة لاحقاً.
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <ShopHeader />

          <ShopFiltersBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            sortBy={sortBy}
            onSort={handleSort}
            totalProducts={totalProducts}
          />

          <div className="mt-8 md:mt-12">
            <ProductsGrid products={products} isLoading={isLoading} />
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}

          <ShopFeatures />
        </div>
      </div>
    </>
  );
}
