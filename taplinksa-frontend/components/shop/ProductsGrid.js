import ProductCard from './ProductCard';

export default function ProductsGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">لا توجد منتجات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <div key={product.id} data-aos="fade-up" data-aos-delay={index * 50}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
