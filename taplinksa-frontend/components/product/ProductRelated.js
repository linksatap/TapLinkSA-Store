// components/product/ProductRelated.js
import Image from 'next/image';

export default function ProductRelated({ relatedProducts = [] }) {
  if (!relatedProducts.length) return null;

  return (
    <div data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-dark">منتجات ذات صلة</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.slice(0, 4).map((related) => (
          <a
            key={related.id}
            href={`/products/${related.slug}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={related.images?.[0]?.src || '/placeholder.jpg'}
                alt={related.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3 md:p-4">
              <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                {related.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gold">
                  {parseFloat(related.price).toFixed(2)} ر.س
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
