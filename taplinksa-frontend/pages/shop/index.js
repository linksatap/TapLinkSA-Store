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
// API FUNCTIONS - Keep all existing logic
// ============================================

const WC_API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

/**
 * Create Basic Auth header for WooCommerce API
 */
function getAuthHeader() {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    console.warn('⚠️ WooCommerce API credentials not configured');
    return {};
  }
  const credentials = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);
  return {
    Authorization: `Basic ${credentials}`,
  };
}

/**
 * Fetch products from WooCommerce API
 */
async function fetchProducts(page = 1, category = null, searchTerm = '', sortBy = 'latest') {
  try {
    if (!WC_API_URL) {
      console.error('❌ NEXT_PUBLIC_WC_API not configured');
      return { data: [], headers: {} };
    }

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', 20); // Match pagination size

    if (category) params.append('category', category);
    if (searchTerm) params.append('search', searchTerm);

    // Handle sorting
    switch (sortBy) {
      case 'popular':
        params.append('orderby', 'popularity');
        break;
      case 'price_asc':
        params.append('orderby', 'price');
        params.append('order', 'asc');
        break;
      case 'price_desc':
        params.append('orderby', 'price');
        params.append('order', 'desc');
        break;
      case 'rating':
        params.append('orderby', 'rating');
        break;
      default:
        params.append('orderby', 'date');
        params.append('order', 'desc');
    }

    const url = `${WC_API_URL}/products?${params.toString()}`;
    console.log(`📡 Fetching: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      return { data: [], headers: {} };
    }

    const data = await response.json();
    const total = response.headers.get('x-wp-total');
    const totalPages = response.headers.get('x-wp-totalpages');

    return {
      data: data || [],
      headers: {
        'x-wp-total': total,
        'x-wp-totalpages': totalPages,
      },
    };
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return { data: [], headers: {} };
  }
}

/**
 * Fetch product categories
 */
async function fetchCategories() {
  try {
    if (!WC_API_URL) {
      console.error('❌ NEXT_PUBLIC_WC_API not configured');
      return [];
    }

    const url = `${WC_API_URL}/products/categories?per_page=100&hide_empty=true`;
    console.log(`📡 Fetching categories: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      console.error(`❌ Categories API Error: ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    return [];
  }
}

// ============================================
// SERVER-SIDE PROPS - FIXED!
// ============================================

export async function getServerSideProps({ query }) {
  try {
    const page = parseInt(query.page) || 1;
    const category = query.category || null;
    const search = query.search || '';
    const sort = query.sort || 'latest';

    console.log('🔄 getServerSideProps - Fetching initial data...');

    // Fetch data in parallel
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetchProducts(page, category, search, sort),
      fetchCategories(),
    ]);

    const products = productsResponse?.data || [];
    const categories = categoriesResponse || [];
    const totalCount = parseInt(productsResponse?.headers?.['x-wp-total'] || 0);
    const totalPages = Math.ceil(totalCount / 20);

    console.log(
      `✅ Loaded: ${products.length} products, ${categories.length} categories, Page ${page} of ${totalPages}`
    );

    return {
      props: {
        initialProducts: products,
        initialCategories: categories,
        initialPage: page,
        initialCategory: category,
        initialSearch: search,
        initialSort: sort,
        initialTotal: totalCount,
        initialTotalPages: totalPages,
      },
      // ⚠️ REMOVED revalidate - getServerSideProps doesn't support ISR
      // Use getStaticProps if you need ISR
    };
  } catch (error) {
    console.error('❌ Error in getServerSideProps:', error);

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
      // Revalidate after 10 seconds on error
    };
  }
}

// ============================================
// SHOP PAGE COMPONENT
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

  // State management
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(initialTotal);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-quad',
      delay: 0,
      once: true,
    });
  }, []);

  // Handle filter/sort changes
  const handleFilterChange = useCallback(async () => {
    setIsLoading(true);
    setCurrentPage(1);

    try {
      const response = await fetchProducts(1, selectedCategory, searchTerm, sortBy);
      const data = response.data || [];
      const total = parseInt(response.headers?.['x-wp-total'] || 0);
      const pages = Math.ceil(total / 20);

      setProducts(data);
      setTotalPages(pages);
      setTotalProducts(total);

      // Update URL without reloading
      const queryString = new URLSearchParams();
      if (selectedCategory) queryString.set('category', selectedCategory);
      if (searchTerm) queryString.set('search', searchTerm);
      if (sortBy !== 'latest') queryString.set('sort', sortBy);

      router.push(
        {
          pathname: '/shop',
          query: Object.fromEntries(queryString) || {},
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, router]);

  // Handle pagination
  const handlePageChange = useCallback(
    async (page) => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const response = await fetchProducts(page, selectedCategory, searchTerm, sortBy);
        const data = response.data || [];

        setProducts(data);
        setCurrentPage(page);

        // Update URL
        const queryString = new URLSearchParams();
        queryString.set('page', page);
        if (selectedCategory) queryString.set('category', selectedCategory);
        if (searchTerm) queryString.set('search', searchTerm);
        if (sortBy !== 'latest') queryString.set('sort', sortBy);

        router.push(
          {
            pathname: '/shop',
            query: Object.fromEntries(queryString),
          },
          undefined,
          { shallow: true }
        );
      } catch (error) {
        console.error('Error changing page:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, searchTerm, sortBy, router]
  );

  // Trigger filter changes when dependencies change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      handleFilterChange();
    }
  }, [selectedCategory, searchTerm, sortBy]);

  // Handlers
  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
  };

  return (
    <>
      <Head>
        <title>متجرنا | أفضل المنتجات والعروض</title>
        <meta
          name="description"
          content="تصفح مجموعتنا الواسعة من المنتجات عالية الجودة مع أفضل الأسعار والعروض الحصرية."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Shop Header */}
          <ShopHeader />

          {/* Filters Bar - Sticky on Mobile */}
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

          {/* Products Section */}
          <div className="mt-8 md:mt-12">
            <ProductsGrid products={products} isLoading={isLoading} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}

          {/* Trust Features - Bottom CTA */}
          <ShopFeatures />
        </div>
      </div>
    </>
  );
}
