import { useState } from 'react';
import Layout from '../../components/layout/Layout';

import ProductsGrid from '../../components/shop/ProductsGrid';
import { getProducts } from '../../lib/api';

export default function Shop({ initialProducts, totalPages }) {
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (currentPage >= totalPages) return;
    setLoading(true);
    const { products: newProducts } = await getProducts(currentPage + 1);
    setProducts([...products, ...newProducts]);
    setCurrentPage(currentPage + 1);
    setLoading(false);
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
              <a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">المتجر</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            متجر TapLink SA
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" data-aos="fade-up" data-aos-delay="100"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            اكتشف مجموعتنا من البطاقات الذكية والحوامل المبتكرة
          </p>
        </div>

        {/* Products Grid */}
        <ProductsGrid products={products} />

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التحميل...' : 'عرض المزيد'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { products, totalPages } = await getProducts(1, 12);
  
  return {
    props: {
      initialProducts: products,
      totalPages,
    },
    revalidate: 60,
  };
}
