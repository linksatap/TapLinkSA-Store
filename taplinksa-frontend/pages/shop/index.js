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

// API - Keep all existing logic intact
async function fetchProducts(page = 1, category = null, searchTerm = '', sortBy = 'latest') {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('per_page', 20); // Matches pagination size
  
  if (category) params.append('category', category);
  if (searchTerm) params.append('search', searchTerm);
  
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WC_API}/products?${params.toString()}`
  );
  
  if (!response.ok) throw new Error('Failed to fetch products');
  
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WC_API}/products/categories?per_page=100`
  );
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function getServerSideProps({ query }) {
  try {
    const page = parseInt(query.page) || 1;
    const category = query.category || null;
    const search = query.search || '';
    const sort = query.sort || 'latest';

    // Fetch initial data
    const [products, categories] = await Promise.all([
      fetchProducts(page, category, search, sort),
      fetchCategories(),
    ]);

    return {
      props: {
        initialProducts: products || [],
        initialCategories: categories || [],
        initialPage: page,
        initialCategory: category,
        initialSearch: search,
        initialSort: sort,
      },
      revalidate: 60, // ISR: Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return {
      props: {
        initialProducts: [],
        initialCategories: [],
        initialPage: 1,
        initialCategory: null,
        initialSearch: '',
        initialSort: 'latest',
      },
      revalidate: 10,
    };
  }
}

export default function Shop({
  initialProducts = [],
  initialCategories = [],
  initialPage = 1,
  initialCategory = null,
  initialSearch = '',
  initialSort = 'latest',
}) {
  const router = useRouter();

  // State management
  const [products, setProducts] = useState(initialProducts?.data || []);
  const [categories, setCategories] = useState(initialCategories);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-quad',
      delay: 0,
      once: true,
    });

    // Set initial values from SSR data
    if (initialProducts?.data) {
      setTotalPages(Math.ceil((initialProducts.headers?.['x-wp-total'] || 0) / 20));
      setTotalProducts(initialProducts.headers?.['x-wp-total'] || initialProducts.data.length);
    }
  }, [initialProducts]);

  // Handle filter/sort changes
  const handleFilterChange = useCallback(async () => {
    setIsLoading(true);
    setCurrentPage(1);

    const params = {
      page: 1,
      category: selectedCategory,
      search: searchTerm,
      sort: sortBy,
    };

    // Clean URL params
    const queryString = new URLSearchParams();
    if (selectedCategory) queryString.set('category', selectedCategory);
    if (searchTerm) queryString.set('search', searchTerm);
    if (sortBy !== 'latest') queryString.set('sort', sortBy);

    // Push router with clean params
    router.push(
      {
        pathname: '/shop',
        query: Object.fromEntries(queryString),
      },
      undefined,
      { shallow: false }
    );

    try {
      const data = await fetchProducts(1, selectedCategory, searchTerm, sortBy);
      setProducts(data?.data || []);
      setTotalPages(Math.ceil((data?.headers?.['x-wp-total'] || 0) / 20));
      setTotalProducts(data?.headers?.['x-wp-total'] || data?.data?.length || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, router]);

  // Handle pagination
  const handlePageChange = useCallback(
    async (page) => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const params = {
        page,
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
      };

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
        { shallow: false }
      );

      try {
        const data = await fetchProducts(page, selectedCategory, searchTerm, sortBy);
        setProducts(data?.data || []);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, searchTerm, sortBy, router]
  );

  // Trigger filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      handleFilterChange();
    }
  }, [selectedCategory, searchTerm, sortBy]);

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
            <ProductsGrid
              products={products}
              isLoading={isLoading}
            />
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
