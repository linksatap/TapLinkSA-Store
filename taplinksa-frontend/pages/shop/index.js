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
// ENVIRONMENT VARIABLES
// ============================================

const WC_API_URL = process.env.NEXT_PUBLIC_WC_API;
const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

// ============================================
// API UTILITY FUNCTIONS
// ============================================

/**
 * Create Basic Auth header for WooCommerce API
 */
function getAuthHeader() {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    console.warn('⚠️  Missing WooCommerce credentials');
    return {};
  }

  try {
    const credentials = Buffer.from(
      `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString('base64');
    return {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Error creating auth header:', error);
    return {};
  }
}

/**
 * Fetch products from WooCommerce API
 */
async function fetchProducts(
  page = 1,
  category = null,
  searchTerm = '',
  sortBy = 'latest'
) {
  try {
    if (!WC_API_URL) {
      console.error('❌ NEXT_PUBLIC_WC_API is not configured in environment variables');
      return { data: [], total: 0, totalPages: 1 };
    }

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', 20);
    params.append('status', 'publish');

    if (category) {
      params.append('category', category);
    }

    if (searchTerm) {
      params.append('search', searchTerm);
    }

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
    console.log(`📡 Fetching products: page=${page}, sort=${sortBy}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
      cache: 'no-store', // Disable caching for server-side
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      return { data: [], total: 0, totalPages: 1 };
    }

    const products = await response.json();
    const total = parseInt(response.headers.get('x-wp-total') || '0');
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');

    console.log(`✅ Loaded ${products.length} products`);

    return {
      data: products,
      total,
      totalPages,
    };
  } catch (error) {
    console.error('❌ fetchProducts error:', error.message);
    return { data: [], total: 0, totalPages: 1 };
  }
}

/**
 * Fetch product categories
 */
async function fetchCategories() {
  try {
    if (!WC_API_URL) {
      console.error('❌ NEXT_PUBLIC_WC_API is not configured');
      return [];
    }

    const url = `${WC_API_URL}/products/categories?per_page=100&hide_empty=true`;
    console.log('📡 Fetching categories...');

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Categories API Error: ${response.status}`);
      return [];
    }

    const categories = await response.json();
    console.log(`✅ Loaded ${categories.length} categories`);

    return categories;
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

    console.log('🔄 getServerSideProps starting...');

    // Fetch data
    const productsData = await fetchProducts(page, category, search, sort);
    const categoriesData = await fetchCategories();

    console.log(`✅ SSR complete: ${productsData.data.length} products loaded`);

    return {
      props: {
        initialProducts: productsData.data,
        initialCategories: categoriesData,
        initialPage: page,
        initialCategory: category,
        initialSearch: search,
        initialSort: sort,
        initialTotal: productsData.total,
        initialTotalPages: productsData.totalPages,
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
        error: 'Failed to load products',
      },
      revalidate: 10,
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
  error = null,
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
  const [hasError, setHasError] = useState(!!error);

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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            ⚠️ حدث خطأ في تحميل المنتجات. يرجى التحقق من إعدادات الـ API.
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
